import { memo, useState } from "react";
import { MainContent } from "@/components/MainContent";
import { AddTransactionForm } from "@/components/AddTransactionForm";
import { ExportButton } from "@/components/ExportButton";
import { Plus } from "lucide-react";
import { Transaction } from "@/types/Transaction";
import { Card } from "@/types/Card";

interface TransactionsProps {
  transactions: Transaction[];
  cards: Card[];
  onDelete: (id: number) => void;
  updateTransaction: (id: number, transaction: Partial<Transaction>) => void;
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

export const Transactions = memo(({
  transactions,
  cards,
  onDelete,
  updateTransaction,
  onAdd
}: TransactionsProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    onAdd(transaction);
    setShowAddForm(false);
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filterType === 'all') return true;
    return transaction.type === filterType;
  });

  const totals = {
    totalIncome: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    totalExpenses: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    balance: 0
  };
  totals.balance = totals.totalIncome - totals.totalExpenses;

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header - Only on mobile */}
      <div className="md:hidden text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Transações
        </h1>
        <p className="text-slate-600 mt-2">Gerencie todas suas movimentações</p>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-4 md:gap-6">
        {/* Left Column - Controls */}
        <div className="md:col-span-1 space-y-6">
          {/* Resumo Rápido */}
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-xl text-center">
              <div className="text-green-600 font-bold text-lg">
                R$ {totals.totalIncome.toFixed(2)}
              </div>
              <div className="text-green-700 text-sm">Receitas</div>
            </div>
            <div className="bg-red-50 p-4 rounded-xl text-center">
              <div className="text-red-600 font-bold text-lg">
                R$ {totals.totalExpenses.toFixed(2)}
              </div>
              <div className="text-red-700 text-sm">Despesas</div>
            </div>
            <div className={`p-4 rounded-xl text-center ${
              totals.balance >= 0 ? 'bg-blue-50' : 'bg-orange-50'
            }`}>
              <div className={`font-bold text-lg ${
                totals.balance >= 0 ? 'text-blue-600' : 'text-orange-600'
              }`}>
                R$ {totals.balance.toFixed(2)}
              </div>
              <div className={`text-sm ${
                totals.balance >= 0 ? 'text-blue-700' : 'text-orange-700'
              }`}>
                Saldo
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="space-y-3">
            <button
              onClick={() => {
                setTransactionType('income');
                setShowAddForm(true);
              }}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition"
            >
              <Plus className="w-5 h-5" />
              Adicionar Receita
            </button>
            <button
              onClick={() => {
                setTransactionType('expense');
                setShowAddForm(true);
              }}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-red-700 transition"
            >
              <Plus className="w-5 h-5" />
              Adicionar Despesa
            </button>
          </div>

          {/* Filtros */}
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-700">Filtros</h3>
            <div className="space-y-2">
              <button
                onClick={() => setFilterType('all')}
                className={`w-full px-4 py-2 rounded-lg font-medium transition text-left ${
                  filterType === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todas as Transações
              </button>
              <button
                onClick={() => setFilterType('income')}
                className={`w-full px-4 py-2 rounded-lg font-medium transition text-left ${
                  filterType === 'income'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Apenas Receitas
              </button>
              <button
                onClick={() => setFilterType('expense')}
                className={`w-full px-4 py-2 rounded-lg font-medium transition text-left ${
                  filterType === 'expense'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Apenas Despesas
              </button>
            </div>
          </div>

          {/* Export */}
          <div className="flex justify-center">
            <ExportButton transactions={transactions} />
          </div>
        </div>

        {/* Right Column - Transaction List */}
        <div className="md:col-span-3">
          <MainContent 
            transactions={filteredTransactions} 
            onDelete={onDelete} 
            updateTransaction={updateTransaction} 
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-6">
        {/* Resumo Rápido */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-xl text-center">
            <div className="text-green-600 font-bold text-lg">
              R$ {totals.totalIncome.toFixed(2)}
            </div>
            <div className="text-green-700 text-sm">Receitas</div>
          </div>
          <div className="bg-red-50 p-4 rounded-xl text-center">
            <div className="text-red-600 font-bold text-lg">
              R$ {totals.totalExpenses.toFixed(2)}
            </div>
            <div className="text-red-700 text-sm">Despesas</div>
          </div>
          <div className={`p-4 rounded-xl text-center ${
            totals.balance >= 0 ? 'bg-blue-50' : 'bg-orange-50'
          }`}>
            <div className={`font-bold text-lg ${
              totals.balance >= 0 ? 'text-blue-600' : 'text-orange-600'
            }`}>
              R$ {totals.balance.toFixed(2)}
            </div>
            <div className={`text-sm ${
              totals.balance >= 0 ? 'text-blue-700' : 'text-orange-700'
            }`}>
              Saldo
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => {
              setTransactionType('income');
              setShowAddForm(true);
            }}
            className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition"
          >
            <Plus className="w-5 h-5" />
            Receita
          </button>
          <button
            onClick={() => {
              setTransactionType('expense');
              setShowAddForm(true);
            }}
            className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-red-700 transition"
          >
            <Plus className="w-5 h-5" />
            Despesa
          </button>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterType === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilterType('income')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterType === 'income'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Receitas
          </button>
          <button
            onClick={() => setFilterType('expense')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterType === 'expense'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Despesas
          </button>
        </div>

        {/* Export */}
        <div className="flex justify-center">
          <ExportButton transactions={transactions} />
        </div>

        {/* Lista de Transações */}
        <MainContent 
          transactions={filteredTransactions} 
          onDelete={onDelete} 
          updateTransaction={updateTransaction} 
        />
      </div>

      {/* Modal de Adicionar */}
      {showAddForm && (
        <AddTransactionForm
          onAdd={handleAddTransaction}
          onClose={() => setShowAddForm(false)}
          cards={cards}
          initialType={transactionType}
        />
      )}
    </div>
  );
});