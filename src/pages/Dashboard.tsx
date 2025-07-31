import { memo } from "react";
import { SummaryCards } from "@/components/SummaryCards";
import { DailyGoals } from "@/components/DailyGoals";
import { AppHeader } from "@/components/AppHeader";
import { Transaction } from "@/types/Transaction";
import { Card } from "@/types/Card";

interface DashboardProps {
  transactions: Transaction[];
  cards: Card[];
  totals: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
  };
  onAddIncome: () => void;
  onAddExpense: () => void;
  markCardAsPaid: (id: number) => void;
  markCardAsUnpaid: (id: number) => void;
  onViewTransactions: () => void;
}

export const Dashboard = memo(({
  transactions,
  cards,
  totals,
  onAddIncome,
  onAddExpense,
  markCardAsPaid,
  markCardAsUnpaid,
  onViewTransactions
}: DashboardProps) => {
  // Últimas 5 transações para preview
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header - Only on mobile */}
      <div className="md:hidden">
        <AppHeader />
      </div>

      {/* Desktop Layout */}
      <div className="space-y-6">
        {/* Summary Cards */}
        <SummaryCards 
          totals={totals} 
          onAddIncome={onAddIncome}
          onAddExpense={onAddExpense}
        />

        {/* Dica de uso */}
        <div className="text-center animate-fade-in">
          <p className="text-slate-600 font-medium">
            💡 Clique nos cards acima para adicionar receitas ou despesas rapidamente
          </p>
        </div>

        {/* Grid com Metas e Transações */}
        <div className="md:grid md:grid-cols-2 md:gap-6 space-y-6 md:space-y-0">
          {/* Metas Diárias */}
          <div>
            <DailyGoals 
              cards={cards} 
              transactions={transactions} 
              onMarkAsPaid={markCardAsPaid}
              onMarkAsUnpaid={markCardAsUnpaid}
            />
          </div>

          {/* Preview das Últimas Transações */}
          {recentTransactions.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">Últimas Transações</h3>
                <button
                  onClick={onViewTransactions}
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                >
                  Ver todas →
                </button>
              </div>
              
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-slate-800">
                        {transaction.description}
                      </div>
                      <div className="text-sm text-slate-500">
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <div className={`font-bold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});