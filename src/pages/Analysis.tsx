import { memo } from "react";
import { CardExpenseSummary } from "@/components/CardExpenseSummary";
import { NextBillsReport } from "@/components/NextBillsReport";
import { FuturePayments } from "@/components/FuturePayments";
import { Transaction } from "@/types/Transaction";
import { Card } from "@/types/Card";

interface AnalysisProps {
  transactions: Transaction[];
  cards: Card[];
  markCardAsPaid: (id: number) => void;
  markCardAsUnpaid: (id: number) => void;
}

export const Analysis = memo(({
  transactions,
  cards,
  markCardAsPaid,
  markCardAsUnpaid
}: AnalysisProps) => {
  return (
    <div className="space-y-8 pb-20 md:pb-6">
      {/* Header - Only on mobile */}
      <div className="md:hidden text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Análise Financeira
        </h1>
        <p className="text-slate-600 mt-2">Relatórios e visão estratégica</p>
      </div>

      {/* Desktop Layout */}
      <div className="md:grid md:grid-cols-2 md:gap-6 space-y-8 md:space-y-0">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Resumo de despesas por cartão e à vista */}
          <CardExpenseSummary 
            cards={cards} 
            transactions={transactions} 
            markCardAsPaid={markCardAsPaid}
            markCardAsUnpaid={markCardAsUnpaid}
          />

          {/* Relatório de próximas faturas por cartão */}
          <NextBillsReport cards={cards} transactions={transactions} />
        </div>

        {/* Right Column */}
        <div>
          {/* Pagamentos Futuros */}
          <FuturePayments transactions={transactions} cards={cards} />
        </div>
      </div>
    </div>
  );
});