
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Transaction } from "@/types/Transaction";
import { Button } from "@/components/ui/button";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast();

  // Load transactions from localStorage on component mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('financial-transactions');
    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions));
      } catch (error) {
        console.error('Erro ao carregar transações:', error);
      }
    }
  }, []);

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    try {
      localStorage.setItem('financial-transactions', JSON.stringify(transactions));
    } catch (error) {
      console.error('Erro ao salvar transações:', error);
    }
  }, [transactions]);

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
            action: <Button variant="outline" onClick={() => markAsReceived(transaction.id)}>Marcar como Recebido</Button>,
            duration: 900000
          });
        }
      }
    });
  }, [transactions, toast]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
    toast({
      title: "Transação adicionada!",
      description: `${transaction.type === 'income' ? 'Receita' : 'Despesa'} de R$ ${transaction.amount.toFixed(2)} registrada com sucesso.`,
    });
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Transação removida",
      description: "A transação foi removida com sucesso.",
    });
  };

  const markAsReceived = (id: string) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id ? { ...transaction, receivedStatus: 'received' } : transaction
      )
    );
    toast({
      title: "Receita Marcada como Recebida!",
      description: "O valor foi registrado em suas receitas.",
    });
  };

  const calculateTotals = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      income: totalIncome,
      expenses: totalExpenses,
      balance: totalIncome - totalExpenses
    };
  };

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    markAsReceived,
    calculateTotals
  };
};
