
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { memo } from "react";

interface SummaryCardsProps {
  totals: {
    income: number;
    expenses: number;
    balance: number;
  };
}

export const SummaryCards = memo(({ totals }: SummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
            Receitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-1">
            R$ {totals.income.toFixed(2)}
          </div>
          <div className="text-emerald-100 text-sm font-medium">
            Total de entradas
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-500 to-rose-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <TrendingDown className="w-6 h-6" />
            </div>
            Despesas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-1">
            R$ {totals.expenses.toFixed(2)}
          </div>
          <div className="text-red-100 text-sm font-medium">
            Total de saídas
          </div>
        </CardContent>
      </Card>

      <Card className={`${totals.balance >= 0 
        ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
        : 'bg-gradient-to-br from-orange-500 to-amber-600'
      } text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Wallet className="w-6 h-6" />
            </div>
            Saldo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-1">
            R$ {totals.balance.toFixed(2)}
          </div>
          <div className={`${totals.balance >= 0 ? 'text-blue-100' : 'text-orange-100'} text-sm font-medium`}>
            {totals.balance >= 0 ? 'Situação positiva' : 'Atenção ao saldo'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
