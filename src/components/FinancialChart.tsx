
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Transaction } from "@/pages/Index";

interface FinancialChartProps {
  transactions: Transaction[];
}

export const FinancialChart = ({ transactions }: FinancialChartProps) => {
  // Group transactions by month
  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthKey,
        receitas: 0,
        despesas: 0,
      };
    }
    
    if (transaction.type === 'income') {
      acc[monthKey].receitas += transaction.amount;
    } else {
      acc[monthKey].despesas += transaction.amount;
    }
    
    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(monthlyData)
    .sort((a: any, b: any) => a.month.localeCompare(b.month))
    .map((item: any) => ({
      ...item,
      month: new Date(item.month + '-01').toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receitas vs Despesas</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p>Dados insuficientes para gerar o gráfico.</p>
            <p className="text-sm mt-1">Adicione algumas transações para visualizar.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `R$ ${Number(value).toFixed(2)}`,
                  name === 'receitas' ? 'Receitas' : 'Despesas'
                ]}
              />
              <Bar dataKey="receitas" fill="#10b981" name="receitas" />
              <Bar dataKey="despesas" fill="#ef4444" name="despesas" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
