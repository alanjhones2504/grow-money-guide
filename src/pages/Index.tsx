import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle } from "lucide-react";
import { AddTransactionForm } from "@/components/AddTransactionForm";
import { usePWALifecycle } from "@/hooks/usePWALifecycle";
import { useTransactions } from "@/hooks/useTransactions";
import { useCards } from "@/hooks/useCards";
import { SummaryCards } from "@/components/SummaryCards";
import { PWAIndicators } from "@/components/PWAIndicators";
import { AppHeader } from "@/components/AppHeader";
import { MainContent } from "@/components/MainContent";
import { CardExpenseSummary } from "@/components/CardExpenseSummary";
import { NextBillsReport } from "@/components/NextBillsReport";
import { CardForm } from "@/components/CardForm";
import { Transaction } from "@/types/Transaction";

const Index = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const pwaLifecycle = usePWALifecycle();
  const { transactions, addTransaction, deleteTransaction, calculateTotals, updateTransaction } = useTransactions();
  const { 
    cards, 
    cardForm, 
    showCardForm, 
    setShowCardForm, 
    handleCardInput, 
    handleAddCard,
    deleteCard
  } = useCards();

  const totals = calculateTotals();

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    addTransaction(transaction);
    setShowAddForm(false);
  };

  return (
    <ScrollArea className="h-screen">
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* PWA Status Indicators */}
          <PWAIndicators pwaLifecycle={pwaLifecycle} />

          {/* Header */}
          <AppHeader />

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
          <MainContent transactions={transactions} onDelete={deleteTransaction} updateTransaction={updateTransaction} />

          {/* Add Transaction Modal */}
          {showAddForm && (
            <AddTransactionForm
              onAdd={handleAddTransaction}
              onClose={() => setShowAddForm(false)}
              cards={cards}
            />
          )}

          {/* Resumo de despesas por cartão e à vista */}
          <CardExpenseSummary cards={cards} transactions={transactions} />

          {/* Relatório de próximas faturas por cartão */}
          <NextBillsReport cards={cards} transactions={transactions} />

          {/* Cadastro de Cartão */}
          <CardForm 
            cards={cards}
            cardForm={cardForm}
            showCardForm={showCardForm}
            setShowCardForm={setShowCardForm}
            handleCardInput={handleCardInput}
            handleAddCard={handleAddCard}
            deleteCard={deleteCard}
          />
        </div>
      </div>
    </ScrollArea>
  );
};

export default Index;
