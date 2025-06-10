
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, Wallet, BarChart3 } from "lucide-react";
import { AddTransactionForm } from "@/components/AddTransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { FinancialChart } from "@/components/FinancialChart";
import { CategoryBreakdown } from "@/components/CategoryBreakdown";
import { SummaryCards } from "@/components/SummaryCards";
import { useTransactions } from "@/hooks/useTransactions";
import { useScheduledIncomeAlerts } from "@/hooks/useScheduledIncomeAlerts";
import { calculateTotals } from "@/utils/transactionUtils";

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
  const [showAddForm, setShowAddForm] = useState(false);
  const { transactions, isLoading, addTransaction, deleteTransaction, markAsReceived } = useTransactions();
  
  // Use the scheduled income alerts hook
  useScheduledIncomeAlerts(transactions, markAsReceived);

  const totals = calculateTotals(transactions);

  const handleAddTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    await addTransaction(transaction);
    setShowAddForm(false);
  };

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
          <SummaryCards totals={totals} />

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
              onAdd={handleAddTransaction}
              onClose={() => setShowAddForm(false)}
            />
          )}
        </div>
      </div>
    </ScrollArea>
  );
};

export default Index;
