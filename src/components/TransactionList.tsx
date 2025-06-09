
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Calendar } from "lucide-react";
import { Transaction } from "@/pages/Index";

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  showAll: boolean;
}

export const TransactionList = ({ transactions, onDelete, showAll }: TransactionListProps) => {
  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {showAll ? 'Todas as Transações' : 'Transações Recentes'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500">
            <p>Nenhuma transação encontrada.</p>
            <p className="text-sm mt-1">Adicione sua primeira transação para começar!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {showAll ? 'Todas as Transações' : 'Transações Recentes'}
          </div>
          {!showAll && transactions.length > 0 && (
            <Badge variant="secondary">{transactions.length} de {transactions.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-medium">{transaction.description}</h3>
                  <Badge 
                    variant={transaction.type === 'income' ? 'default' : 'destructive'}
                    className={transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                  >
                    {transaction.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                  {transaction.notes && (
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                      {transaction.notes}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-lg font-bold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toFixed(2)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(transaction.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
