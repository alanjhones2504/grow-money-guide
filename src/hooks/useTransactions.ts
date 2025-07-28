import { useState, useEffect, useMemo, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Transaction } from "@/types/Transaction";
import { Button } from "@/components/ui/button";
import { TransactionStorage } from "@/utils/storage";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast();

  // Load transactions from localStorage on component mount
  useEffect(() => {
    try {
      const savedTransactions = TransactionStorage.load();
      setTransactions(savedTransactions);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      toast({
        title: "Erro ao carregar transações",
        description: "Não foi possível carregar suas transações salvas.",
        variant: "destructive"
      });
      setTransactions([]);
    }
  }, [toast]);

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    if (transactions.length === 0) return; // Não salvar array vazio no primeiro carregamento
    
    const success = TransactionStorage.save(transactions);
    if (!success) {
      toast({
        title: "Erro ao salvar transações",
        description: "Suas transações não puderam ser salvas localmente. Verifique o espaço disponível.",
        variant: "destructive"
      });
    }
  }, [transactions, toast]);

  // Check for scheduled income on app load and daily
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    transactions.forEach(transaction => {
      if (transaction.type === 'income' && transaction.receivedStatus === 'scheduled' && transaction.scheduledDate) {
        const scheduled = new Date(transaction.scheduledDate);
        scheduled.setHours(0, 0, 0, 0);

        if (scheduled <= today) {
          toast({
            title: "Receita Agendada Vencida!",
            description: `Você recebeu R$ ${transaction.amount.toFixed(2)} (${transaction.description})?`,
            duration: 900000
          });
        }
      }
    });
  }, [transactions, toast]);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    try {
      // Validar apenas os dados essenciais
      if (!transaction.amount || transaction.amount <= 0) {
        throw new Error('O valor da transação deve ser maior que zero');
      }
      
      if (!transaction.description || transaction.description.trim() === '') {
        throw new Error('A descrição da transação é obrigatória');
      }
      
      const newTransaction: Transaction = {
        ...transaction,
        id: Date.now().toString(),
        // Sanitizar e aplicar valores padrão
        description: transaction.description.trim(),
        category: transaction.category?.trim() || 'Outros',
        date: transaction.date || new Date().toISOString().split('T')[0],
        notes: transaction.notes ? transaction.notes.trim() : undefined
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      toast({
        title: "Transação adicionada!",
        description: `${transaction.type === 'income' ? 'Receita' : 'Despesa'} de R$ ${transaction.amount.toFixed(2)} registrada com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      toast({
        title: "Erro ao adicionar transação",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao adicionar a transação.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Transação removida",
      description: "A transação foi removida com sucesso.",
    });
  }, [toast]);

  const markAsReceived = useCallback((id: string) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id ? { ...transaction, receivedStatus: 'received' } : transaction
      )
    );
    toast({
      title: "Receita Marcada como Recebida!",
      description: "O valor foi registrado em suas receitas.",
    });
  }, [toast]);

  const updateTransaction = useCallback((id: string, updated: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
    toast({
      title: "Transação atualizada!",
      description: "A transação foi alterada com sucesso.",
    });
  }, [toast]);

  const calculateTotals = useCallback(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Para despesas, calcular o valor da parcela mensal (não o valor total)
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => {
        // Se tem parcelas, dividir o valor total pelo número de parcelas
        const monthlyAmount = t.installments && t.installments > 1 
          ? t.amount / t.installments 
          : t.amount;
        return sum + monthlyAmount;
      }, 0);
    
    return {
      income: totalIncome,
      expenses: totalExpenses,
      balance: totalIncome - totalExpenses
    };
  }, [transactions]);

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    markAsReceived,
    calculateTotals,
    updateTransaction
  };
};
