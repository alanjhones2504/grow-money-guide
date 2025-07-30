import { Card } from "@/types/Card";
import { Transaction } from "@/types/Transaction";
import { memo } from "react";

interface NextBillsReportProps {
  cards: Card[];
  transactions: Transaction[];
}

export const NextBillsReport = memo(({ cards, transactions }: NextBillsReportProps) => {
  return (
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
              {card.nome} ({card.banco}) — Vence dia {card.diaVencimento}: <span className="font-bold">R$ {totalFatura.toFixed(2)}</span>
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
  );
});