
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Calendar, Receipt } from "lucide-react";
import { Transaction } from "@/pages/Index";

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  showAll: boolean;
}

export const TransactionList = ({ transactions, onDelete, showAll }: TransactionListProps) => {
  if (transactions.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            {showAll ? 'Todas as Transações' : 'Transações Recentes'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 space-y-4">
            <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl w-16 h-16 mx-auto flex items-center justify-center">
              <Receipt className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <p className="text-slate-600 font-medium text-lg">Nenhuma transação encontrada</p>
              <p className="text-slate-500 text-sm mt-2">Adicione sua primeira transação para começar!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            {showAll ? 'Todas as Transações' : 'Transações Recentes'}
          </div>
          {!showAll && transactions.length > 0 && (
            <Badge variant="secondary" className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 font-semibold px-3 py-1">
              {transactions.length} {transactions.length === 1 ? 'transação' : 'transações'}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-5 bg-gradient-to-r from-white to-slate-50 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 hover:scale-[1.02]"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="font-bold text-slate-800 text-lg">{transaction.description}</h3>
                  <Badge 
                    variant={transaction.type === 'income' ? 'default' : 'destructive'}
                    className={`${transaction.type === 'income' 
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md' 
                      : 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md'
                    } font-semibold px-3 py-1 rounded-lg`}
                  >
                    {transaction.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-6 text-sm text-slate-600">
                  <span className="flex items-center gap-2 font-medium">
                    <Calendar className="w-4 h-4" />
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </span>
                  {transaction.notes && (
                    <span className="text-xs bg-gradient-to-r from-slate-100 to-slate-200 px-3 py-2 rounded-lg font-medium text-slate-700">
                      {transaction.notes}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`text-2xl font-bold ${
                    transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toFixed(2)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(transaction.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-3 rounded-xl transition-all duration-200 hover:scale-110"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
