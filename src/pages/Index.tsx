
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, TrendingUp, TrendingDown, Wallet, BarChart3, PieChart } from "lucide-react";
import { AddTransactionForm } from "@/components/AddTransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { FinancialChart } from "@/components/FinancialChart";
import { CategoryBreakdown } from "@/components/CategoryBreakdown";
import { useToast } from "@/hooks/use-toast";

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  notes?: string;
}

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  // Load transactions from localStorage on component mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('financial-transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('financial-transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setShowAddForm(false);
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
  );
};

export default Index;
