import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, TrendingUp, TrendingDown, Wallet, BarChart3, PieChart } from "lucide-react";
import { AddTransactionForm } from "@/components/AddTransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { FinancialChart } from "@/components/FinancialChart";
import { CategoryBreakdown } from "@/components/CategoryBreakdown";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  notes?: string;
  paymentMethod?: 'pix' | 'card';
  installments?: number;
  receivedStatus?: 'received' | 'scheduled';
  scheduledDate?: string;
}

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  // Load transactions from Supabase on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        toast({
          title: "Erro ao carregar transações",
          description: "Não foi possível carregar as transações do banco de dados.",
          variant: "destructive"
        });
      } else {
        setTransactions(data || []);
      }
    };

    fetchTransactions();
  }, [toast]);

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
            duration: 900000 // Long duration to allow user interaction
          });
        }
      }
    });
  }, [transactions, toast]);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select();

    if (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Erro ao adicionar transação",
        description: "Não foi possível registrar a transação no banco de dados.",
        variant: "destructive"
      });
      return;
    }
    if (data) {
      setTransactions(prev => [...data, ...prev]); // Adiciona a nova transação (com o ID gerado pelo Supabase) ao topo
    }

    setShowAddForm(false);
    toast({
      title: "Transação adicionada!",
      description: `${transaction.type === 'income' ? 'Receita' : 'Despesa'} de R$ ${transaction.amount.toFixed(2)} registrada com sucesso.`,
    });
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting transaction:', error);
      toast({
        title: "Erro ao remover transação",
        description: "Não foi possível remover a transação do banco de dados.",
        variant: "destructive"
      });
      return;
    }

    setTransactions(prev => prev.filter(t => t.id !== id)); // Remove do estado local após sucesso

    toast({
      title: "Transação removida",
      description: "A transação foi removida com sucesso.",
    });
  };

  const markAsReceived = async (id: string) => {
    const { data, error } = await supabase
      .from('transactions')
      .update({ receivedStatus: 'received' })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating transaction:', error);
      toast({
        title: "Erro ao marcar como recebido",
        description: "Não foi possível atualizar a transação no banco de dados.",
        variant: "destructive"
      });
      return;
    }

    if (data) {
      setTransactions(prev =>
        prev.map(transaction =>
          transaction.id === id ? data[0] : transaction
        )
      ); // Atualiza o estado local com os dados retornados pelo Supabase
    }

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

  const totals = calculateTotals();

  return (
    <ScrollArea className="h-screen">
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <Wallet className="text-white w-8 h-8" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Finanças na Palma da Mão
              </h1>
            </div>
            <p className="text-slate-600 text-xl font-medium max-w-2xl mx-auto">
              Controle suas finanças de forma simples, elegante e eficiente
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  Receitas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-1">
                  R$ {totals.income.toFixed(2)}
                </div>
                <div className="text-emerald-100 text-sm font-medium">
                  Total de entradas
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500 to-rose-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <TrendingDown className="w-6 h-6" />
                  </div>
                  Despesas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-1">
                  R$ {totals.expenses.toFixed(2)}
                </div>
                <div className="text-red-100 text-sm font-medium">
                  Total de saídas
                </div>
              </CardContent>
            </Card>

            <Card className={`${totals.balance >= 0 
              ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
              : 'bg-gradient-to-br from-orange-500 to-amber-600'
            } text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Wallet className="w-6 h-6" />
                  </div>
                  Saldo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-1">
                  R$ {totals.balance.toFixed(2)}
                </div>
                <div className={`${totals.balance >= 0 ? 'text-blue-100' : 'text-orange-100'} text-sm font-medium`}>
                  {totals.balance >= 0 ? 'Situação positiva' : 'Atenção ao saldo'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add Transaction Button */}
          <div className="flex justify-center animate-fade-in">
            <Button 
              onClick={() => setShowAddForm(true)}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl border-0"
            >
              <PlusCircle className="w-6 h-6 mr-3" />
              Nova Transação
            </Button>
          </div>

          {/* Main Content */}
          <div className="animate-fade-in">
            <Tabs defaultValue="overview" className="space-y-6">
              <div className="flex justify-center">
                <TabsList className="grid w-full max-w-md grid-cols-3 bg-white/80 backdrop-blur-sm shadow-lg border-0 p-1 rounded-2xl">
                  <TabsTrigger value="overview" className="rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                    Visão Geral
                  </TabsTrigger>
                  <TabsTrigger value="transactions" className="rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                    Transações
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Análises
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <FinancialChart transactions={transactions} />
                  <CategoryBreakdown transactions={transactions} />
                </div>
                <TransactionList 
                  transactions={transactions.slice(0, 5)} 
                  onDelete={deleteTransaction}
                  showAll={false}
                />
              </TabsContent>

              <TabsContent value="transactions">
                <TransactionList 
                  transactions={transactions} 
                  onDelete={deleteTransaction}
                  showAll={true}
                />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <FinancialChart transactions={transactions} />
                  <CategoryBreakdown transactions={transactions} />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Add Transaction Modal */}
          {showAddForm && (
            <AddTransactionForm
              onAdd={addTransaction}
              onClose={() => setShowAddForm(false)}
            />
          )}
        </div>
      </div>
    </ScrollArea>
  );
};

export default Index;
