
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, Plus } from "lucide-react";
import { memo } from "react";

interface SummaryCardsProps {
  totals: {
    income: number;
    expenses: number;
    balance: number;
  };
  onAddIncome: () => void;
  onAddExpense: () => void;
}

export const SummaryCards = memo(({ totals, onAddIncome, onAddExpense }: SummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      {/* Card de Receitas - Clicável */}
      <Card 
        className="bg-gradient-to-br from-emerald-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group relative overflow-hidden"
        onClick={onAddIncome}
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="pb-3 relative z-10">
          <CardTitle className="flex items-center justify-between text-xl font-semibold">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <TrendingUp className="w-6 h-6" />
              </div>
              Receitas
            </div>
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Plus className="w-5 h-5" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-4xl font-bold mb-1">
            R$ {totals.income.toFixed(2)}
          </div>
          <div className="text-emerald-100 text-sm font-medium group-hover:text-white transition-colors duration-300">
            Clique para adicionar receita
          </div>
        </CardContent>
      </Card>

      {/* Card de Despesas - Clicável */}
      <Card 
        className="bg-gradient-to-br from-red-500 to-rose-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group relative overflow-hidden"
        onClick={onAddExpense}
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="pb-3 relative z-10">
          <CardTitle className="flex items-center justify-between text-xl font-semibold">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <TrendingDown className="w-6 h-6" />
              </div>
              Despesas
            </div>
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Plus className="w-5 h-5" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-4xl font-bold mb-1">
            R$ {totals.expenses.toFixed(2)}
          </div>
          <div className="text-red-100 text-sm font-medium group-hover:text-white transition-colors duration-300">
            Clique para adicionar despesa
          </div>
        </CardContent>
      </Card>

      {/* Card de Saldo - Apenas informativo */}
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
