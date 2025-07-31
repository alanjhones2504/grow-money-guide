import { Card } from "@/types/Card";
import { Transaction } from "@/types/Transaction";
import { memo } from "react";

interface CardExpenseSummaryProps {
  cards: Card[];
  transactions: Transaction[];
  markCardAsPaid: (id: number) => void;
  markCardAsUnpaid: (id: number) => void;
}

export const CardExpenseSummary = memo(({ cards, transactions, markCardAsPaid, markCardAsUnpaid }: CardExpenseSummaryProps) => {
  const handleTogglePaid = (card: Card) => {
    if (card.isPaid) {
      markCardAsUnpaid(card.id);
    } else {
      markCardAsPaid(card.id);
    }
  };

  return (
    <div className="mt-8 max-w-md mx-auto bg-indigo-50 rounded shadow p-6">
      <h2 className="text-lg font-bold mb-4 text-indigo-800">Resumo de Despesas</h2>
      <ul className="space-y-3">
        {cards.map(card => {
          const total = transactions
            .filter(t => t.type === 'expense' && t.paymentMethod === 'card' && t.cardId === String(card.id))
            .reduce((sum, t) => sum + t.amount, 0);
          
          return (
            <li 
              key={card.id} 
              className={`flex justify-between items-center p-3 rounded-lg transition-all duration-200 ${
                card.isPaid 
                  ? 'bg-green-100 border-2 border-green-300' 
                  : 'bg-white border-2 border-indigo-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleTogglePaid(card)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                    card.isPaid
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-green-400 bg-white'
                  }`}
                >
                  {card.isPaid && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <span className={`font-medium ${
                  card.isPaid 
                    ? 'text-green-700' 
                    : 'text-indigo-700'
                }`}>
                  {card.nome} ({card.banco}) {card.isPaid && <span className="text-green-600 font-semibold">Pago</span>}
                </span>
              </div>
              <span className={`font-bold ${
                card.isPaid ? 'text-green-700' : 'text-indigo-800'
              }`}>
                R$ {total.toFixed(2)}
              </span>
            </li>
          );
        })}
        
        {/* Despesas à vista */}
        <li className="flex justify-between items-center border-t-2 border-indigo-200 pt-3 mt-3 bg-white p-3 rounded-lg">
          <span className="font-medium text-green-700">À vista</span>
          <span className="font-bold text-green-800">R$ {transactions
            .filter(t => t.type === 'expense' && (!t.paymentMethod || t.paymentMethod !== 'card'))
            .reduce((sum, t) => sum + t.amount, 0)
            .toFixed(2)}</span>
        </li>
      </ul>
    </div>
  );
});