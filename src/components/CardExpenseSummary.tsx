import { Card } from "@/types/Card";
import { Transaction } from "@/types/Transaction";
import { memo } from "react";

interface CardExpenseSummaryProps {
  cards: Card[];
  transactions: Transaction[];
}

export const CardExpenseSummary = memo(({ cards, transactions }: CardExpenseSummaryProps) => {
  return (
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
  );
});