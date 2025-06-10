
import { useState, useEffect } from "react";
import { Transaction } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load transactions from Supabase on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        console.log('Fetching transactions from Supabase...');
        setIsLoading(true);

        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false });

        console.log('Supabase response:', { data, error });

        if (error) {
          console.error('Supabase error details:', error);
          toast({
            title: "Erro ao carregar transações",
            description: `Erro: ${error.message}. Verifique se a tabela 'transactions' existe no Supabase.`,
            variant: "destructive"
          });
          setTransactions([]);
        } else {
          console.log('Transactions loaded successfully:', data);
          setTransactions(data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        toast({
          title: "Erro de conexão",
          description: "Erro inesperado ao conectar com o banco de dados. Verifique as configurações do Supabase.",
          variant: "destructive"
        });
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [toast]);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      console.log('Adding transaction:', transaction);
      
      const { data, error } = await supabase
        .from('transactions')
        .insert([transaction])
        .select();

      if (error) {
        console.error('Error adding transaction:', error);
        toast({
          title: "Erro ao adicionar transação",
          description: `Erro: ${error.message}`,
          variant: "destructive"
        });
        return;
      }
      
      if (data) {
        console.log('Transaction added successfully:', data);
        setTransactions(prev => [...data, ...prev]);
      }

      toast({
        title: "Transação adicionada!",
        description: `${transaction.type === 'income' ? 'Receita' : 'Despesa'} de R$ ${transaction.amount.toFixed(2)} registrada com sucesso.`,
      });
    } catch (err) {
      console.error('Unexpected error adding transaction:', err);
      toast({
        title: "Erro inesperado",
        description: "Erro inesperado ao adicionar transação.",
        variant: "destructive"
      });
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      console.log('Deleting transaction:', id);
      
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting transaction:', error);
        toast({
          title: "Erro ao remover transação",
          description: `Erro: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      setTransactions(prev => prev.filter(t => t.id !== id));
      toast({
        title: "Transação removida",
        description: "A transação foi removida com sucesso.",
      });
    } catch (err) {
      console.error('Unexpected error deleting transaction:', err);
      toast({
        title: "Erro inesperado",
        description: "Erro inesperado ao remover transação.",
        variant: "destructive"
      });
    }
  };

  const markAsReceived = async (id: string) => {
    try {
      console.log('Marking transaction as received:', id);
      
      const { data, error } = await supabase
        .from('transactions')
        .update({ receivedStatus: 'received' })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating transaction:', error);
        toast({
          title: "Erro ao marcar como recebido",
          description: `Erro: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      if (data) {
        setTransactions(prev =>
          prev.map(transaction =>
            transaction.id === id ? data[0] : transaction
          )
        );
      }

      toast({
        title: "Receita Marcada como Recebida!",
        description: "O valor foi registrado em suas receitas.",
      });
    } catch (err) {
      console.error('Unexpected error updating transaction:', err);
      toast({
        title: "Erro inesperado",
        description: "Erro inesperado ao atualizar transação.",
        variant: "destructive"
      });
    }
  };

  return {
    transactions,
    isLoading,
    addTransaction,
    deleteTransaction,
    markAsReceived
  };
};
