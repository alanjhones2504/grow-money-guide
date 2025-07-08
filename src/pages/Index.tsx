import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle } from "lucide-react";
import { AddTransactionForm } from "@/components/AddTransactionForm";
import { usePWALifecycle } from "@/hooks/usePWALifecycle";
import { useTransactions } from "@/hooks/useTransactions";
import { SummaryCards } from "@/components/SummaryCards";
import { PWAIndicators } from "@/components/PWAIndicators";
import { AppHeader } from "@/components/AppHeader";
import { MainContent } from "@/components/MainContent";
import { Transaction } from "@/types/Transaction";

// Novo tipo para cartão
interface Card {
  id: number;
  nome: string;
  banco: string;
  limite: string;
  fechamento: string;
}

const Index = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const pwaLifecycle = usePWALifecycle();
  const { transactions, addTransaction, deleteTransaction, calculateTotals } = useTransactions();

  // Estado para cartões
  const [cards, setCards] = useState<Card[]>([]);
  const [cardForm, setCardForm] = useState({ nome: "", banco: "", limite: "", fechamento: "" });
  const [showCardForm, setShowCardForm] = useState(false);

  // Carregar cartões do localStorage ao iniciar
  useEffect(() => {
    const savedCards = localStorage.getItem("cards");
    if (savedCards) {
      setCards(JSON.parse(savedCards));
    }
  }, []);

  // Salvar cartões no localStorage sempre que cards mudar
  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
  }, [cards]);

  const totals = calculateTotals();

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    addTransaction(transaction);
    setShowAddForm(false);
  };

  const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardForm({ ...cardForm, [e.target.name]: e.target.value });
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardForm.nome) return;
    setCards([
      ...cards,
      { id: Date.now(), ...cardForm }
    ]);
    setCardForm({ nome: "", banco: "", limite: "", fechamento: "" });
    setShowCardForm(false); // Fechar formulário após salvar
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
          <MainContent transactions={transactions} onDelete={deleteTransaction} />

          {/* Add Transaction Modal */}
          {showAddForm && (
            <AddTransactionForm
              onAdd={handleAddTransaction}
              onClose={() => setShowAddForm(false)}
              cards={cards}
            />
          )}

          {/* Resumo de despesas por cartão e à vista */}
          <div className="mt-8 max-w-md mx-auto bg-indigo-50 rounded shadow p-6">
            <h2 className="text-lg font-bold mb-4 text-indigo-800">Resumo de Despesas</h2>
            <ul className="space-y-2">
              {cards.map(card => {
                const total = transactions
                  .filter(t => t.type === 'expense' && t.paymentMethod === 'card' && t.cardId === String(card.id))
                  .reduce((sum, t) => sum + t.amount, 0);
                return (
                  <li key={card.id} className="flex justify-between items-center">
                    <span className="font-medium text-indigo-700">{card.nome} ({card.banco})</span>
                    <span className="font-bold">R$ {total.toFixed(2)}</span>
                  </li>
                );
              })}
              {/* Despesas à vista */}
              <li className="flex justify-between items-center border-t pt-2 mt-2">
                <span className="font-medium text-green-700">À vista</span>
                <span className="font-bold">R$ {transactions
                  .filter(t => t.type === 'expense' && (!t.paymentMethod || t.paymentMethod !== 'card'))
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toFixed(2)}</span>
              </li>
            </ul>
          </div>

          {/* Relatório de próximas faturas por cartão */}
          <div className="mt-8 max-w-md mx-auto bg-purple-50 rounded shadow p-6">
            <h2 className="text-lg font-bold mb-4 text-purple-800">Próximas Faturas</h2>
            {cards.map(card => {
              // Filtrar despesas parceladas neste cartão
              const comprasParceladas = transactions.filter(t =>
                t.type === 'expense' &&
                t.paymentMethod === 'card' &&
                t.cardId === String(card.id) &&
                t.installments && t.installments > 1
              );
              // Calcular total da próxima fatura (soma das próximas parcelas)
              const totalFatura = comprasParceladas.reduce((sum, t) => sum + (t.amount / (t.installments || 1)), 0);
              return (
                <div key={card.id} className="mb-6">
                  <div className="font-semibold text-purple-700 mb-2">
                    {card.nome} ({card.banco}) — Próxima fatura: <span className="font-bold">R$ {totalFatura.toFixed(2)}</span>
                  </div>
                  {comprasParceladas.length === 0 ? (
                    <div className="text-gray-500 text-sm">Nenhuma compra parcelada.</div>
                  ) : (
                    <ul className="space-y-1">
                      {comprasParceladas.map(t => (
                        <li key={t.description + t.amount + t.date} className="flex justify-between items-center text-sm">
                          <span>{t.description} // 1/{t.installments}</span>
                          <span className="font-bold">R$ {(t.amount / (t.installments || 1)).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          {/* Cadastro de Cartão (sempre o último bloco) */}
          <div className="mt-12 max-w-md mx-auto bg-white rounded shadow p-6">
            {!showCardForm ? (
              <button
                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition font-semibold"
                onClick={() => setShowCardForm(true)}
              >
                Cadastrar Cartão
              </button>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">Cadastrar Novo Cartão</h2>
                <form onSubmit={handleAddCard} className="space-y-4">
                  <input
                    type="text"
                    name="nome"
                    placeholder="Nome da pessoa"
                    value={cardForm.nome}
                    onChange={handleCardInput}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                  <input
                    type="text"
                    name="banco"
                    placeholder="Banco"
                    value={cardForm.banco}
                    onChange={handleCardInput}
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    type="number"
                    name="limite"
                    placeholder="Limite"
                    value={cardForm.limite}
                    onChange={handleCardInput}
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    type="date"
                    name="fechamento"
                    placeholder="Data de fechamento"
                    value={cardForm.fechamento}
                    onChange={handleCardInput}
                    className="w-full border rounded px-3 py-2"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                    >
                      Salvar Cartão
                    </button>
                    <button
                      type="button"
                      className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
                      onClick={() => setShowCardForm(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
                {/* Lista de cartões cadastrados (dentro do bloco de cadastro) */}
                {cards.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Cartões cadastrados:</h3>
                    <ul className="space-y-1">
                      {cards.map(card => (
                        <li key={card.id} className="border rounded px-3 py-1">
                          {card.nome} - {card.banco} - Limite: {card.limite} - Fechamento: {card.fechamento}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Index;
