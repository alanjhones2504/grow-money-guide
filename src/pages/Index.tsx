import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { DataManager } from "@/components/DataManager";
import { DailyGoals } from "@/components/DailyGoals";
import { Transaction } from "@/types/Transaction";

const Index = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
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

  const handleDataChange = () => {
    // Recarregar dados quando houver mudanças (importação/limpeza)
    window.location.reload();
  };

  // Funções para abrir formulário com tipo específico
  const handleAddIncome = () => {
    setTransactionType('income');
    setShowAddForm(true);
  };

  const handleAddExpense = () => {
    setTransactionType('expense');
    setShowAddForm(true);
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
          <SummaryCards 
            totals={totals} 
            onAddIncome={handleAddIncome}
            onAddExpense={handleAddExpense}
          />

          {/* Metas Diárias */}
          <DailyGoals cards={cards} transactions={transactions} />

          {/* Dica de uso */}
          <div className="text-center animate-fade-in">
            <p className="text-slate-600 text-lg font-medium">
              💡 Clique nos cards acima para adicionar receitas ou despesas rapidamente
            </p>
          </div>

          {/* Main Content */}
          <MainContent transactions={transactions} onDelete={deleteTransaction} updateTransaction={updateTransaction} />

          {/* Add Transaction Modal */}
          {showAddForm && (
            <AddTransactionForm
              onAdd={handleAddTransaction}
              onClose={() => setShowAddForm(false)}
              cards={cards}
              initialType={transactionType}
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

          {/* Gerenciador de Dados Locais */}
          <DataManager onDataChange={handleDataChange} />
        </div>
      </div>
    </ScrollArea>
  );
};

export default Index;
