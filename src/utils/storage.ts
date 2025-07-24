import { Transaction } from "@/types/Transaction";
import { Card } from "@/types/Card";

// Chaves para o localStorage
const STORAGE_KEYS = {
  TRANSACTIONS: 'financial-transactions',
  CARDS: 'cards',
  SETTINGS: 'app-settings',
  BACKUP: 'data-backup'
} as const;

// Interface para backup completo
interface DataBackup {
  transactions: Transaction[];
  cards: Card[];
  timestamp: string;
  version: string;
}

// Classe para gerenciar armazenamento local
export class LocalStorage {
  
  // Verificar se localStorage está disponível
  static isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  // Salvar dados com tratamento de erro
  static setItem<T>(key: string, data: T): boolean {
    try {
      if (!this.isAvailable()) return false;
      
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Erro ao salvar ${key}:`, error);
      return false;
    }
  }

  // Carregar dados com tratamento de erro
  static getItem<T>(key: string, defaultValue: T): T {
    try {
      if (!this.isAvailable()) return defaultValue;
      
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Erro ao carregar ${key}:`, error);
      return defaultValue;
    }
  }

  // Remover item
  static removeItem(key: string): boolean {
    try {
      if (!this.isAvailable()) return false;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Erro ao remover ${key}:`, error);
      return false;
    }
  }

  // Obter tamanho usado do localStorage
  static getStorageSize(): { used: number; total: number } {
    try {
      let used = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length;
        }
      }
      
      // Estimar limite (geralmente 5-10MB)
      const total = 5 * 1024 * 1024; // 5MB
      
      return { used, total };
    } catch {
      return { used: 0, total: 0 };
    }
  }

  // Criar backup completo dos dados
  static createBackup(): DataBackup | null {
    try {
      const transactions = this.getItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
      const cards = this.getItem<Card[]>(STORAGE_KEYS.CARDS, []);
      
      const backup: DataBackup = {
        transactions,
        cards,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };
      
      // Salvar backup no localStorage também
      this.setItem(STORAGE_KEYS.BACKUP, backup);
      
      return backup;
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      return null;
    }
  }

  // Restaurar backup
  static restoreBackup(backup: DataBackup): boolean {
    try {
      const success1 = this.setItem(STORAGE_KEYS.TRANSACTIONS, backup.transactions);
      const success2 = this.setItem(STORAGE_KEYS.CARDS, backup.cards);
      
      return success1 && success2;
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      return false;
    }
  }

  // Exportar dados para arquivo
  static exportToFile(): void {
    const backup = this.createBackup();
    if (!backup) return;
    
    const dataStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `financas-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  // Importar dados de arquivo
  static importFromFile(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const backup = JSON.parse(e.target?.result as string) as DataBackup;
          const success = this.restoreBackup(backup);
          resolve(success);
        } catch (error) {
          console.error('Erro ao importar backup:', error);
          resolve(false);
        }
      };
      
      reader.onerror = () => resolve(false);
      reader.readAsText(file);
    });
  }

  // Limpar todos os dados
  static clearAllData(): boolean {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        this.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      return false;
    }
  }
}

// Funções específicas para transações
export const TransactionStorage = {
  save: (transactions: Transaction[]) => 
    LocalStorage.setItem(STORAGE_KEYS.TRANSACTIONS, transactions),
  
  load: () => 
    LocalStorage.getItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []),
  
  add: (transaction: Transaction) => {
    const transactions = TransactionStorage.load();
    transactions.unshift(transaction);
    return TransactionStorage.save(transactions);
  },
  
  remove: (id: string) => {
    const transactions = TransactionStorage.load();
    const filtered = transactions.filter(t => t.id !== id);
    return TransactionStorage.save(filtered);
  },
  
  update: (id: string, updates: Partial<Transaction>) => {
    const transactions = TransactionStorage.load();
    const updated = transactions.map(t => 
      t.id === id ? { ...t, ...updates } : t
    );
    return TransactionStorage.save(updated);
  }
};

// Funções específicas para cartões
export const CardStorage = {
  save: (cards: Card[]) => 
    LocalStorage.setItem(STORAGE_KEYS.CARDS, cards),
  
  load: () => 
    LocalStorage.getItem<Card[]>(STORAGE_KEYS.CARDS, []),
  
  add: (card: Card) => {
    const cards = CardStorage.load();
    cards.push(card);
    return CardStorage.save(cards);
  },
  
  remove: (id: number) => {
    const cards = CardStorage.load();
    const filtered = cards.filter(c => c.id !== id);
    return CardStorage.save(filtered);
  }
};