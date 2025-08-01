import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AddTransactionForm } from "@/components/AddTransactionForm";
import { usePWALifecycle } from "@/hooks/usePWALifecycle";
import { useTransactions } from "@/hooks/useTransactions";
import { useCards } from "@/hooks/useCards";
import { PWAIndicators } from "@/components/PWAIndicators";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/pages/Dashboard";
import { Transactions } from "@/pages/Transactions";
import { Analysis } from "@/pages/Analysis";
import { Settings } from "@/pages/Settings";
import { Transaction } from "@/types/Transaction";

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
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
    deleteCard,
    markCardAsPaid,
    markCardAsUnpaid,
    editingCardId,
    startEditCard,
    updateCard,
    cancelEdit
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

  const handleViewTransactions = () => {
    setActiveTab('transactions');
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            transactions={transactions}
            cards={cards}
            totals={totals}
            onAddIncome={handleAddIncome}
            onAddExpense={handleAddExpense}
            markCardAsPaid={markCardAsPaid}
            markCardAsUnpaid={markCardAsUnpaid}
            onViewTransactions={handleViewTransactions}
          />
        );
      case 'transactions':
        return (
          <Transactions
            transactions={transactions}
            cards={cards}
            onDelete={deleteTransaction}
            updateTransaction={updateTransaction}
            onAdd={handleAddTransaction}
          />
        );
      case 'analysis':
        return (
          <Analysis
            transactions={transactions}
            cards={cards}
            markCardAsPaid={markCardAsPaid}
            markCardAsUnpaid={markCardAsUnpaid}
          />
        );
      case 'settings':
        return (
          <Settings
            cards={cards}
            cardForm={cardForm}
            showCardForm={showCardForm}
            setShowCardForm={setShowCardForm}
            handleCardInput={handleCardInput}
            handleAddCard={handleAddCard}
            deleteCard={deleteCard}
            editingCardId={editingCardId}
            startEditCard={startEditCard}
            updateCard={updateCard}
            cancelEdit={cancelEdit}
            onDataChange={handleDataChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <ScrollArea className="h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-md md:max-w-4xl lg:max-w-5xl mx-auto">
            {/* PWA Status Indicators */}
            <PWAIndicators pwaLifecycle={pwaLifecycle} />

            {/* Conteúdo da aba ativa */}
            {renderActiveTab()}

            {/* Add Transaction Modal */}
            {showAddForm && (
              <AddTransactionForm
                onAdd={handleAddTransaction}
                onClose={() => setShowAddForm(false)}
                cards={cards}
                initialType={transactionType}
              />
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Index;
