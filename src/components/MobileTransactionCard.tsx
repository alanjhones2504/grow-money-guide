import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trash2, Pencil } from "lucide-react";
import { Transaction } from "@/types/Transaction";

interface MobileTransactionCardProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
  onEdit?: () => void;
}

export const MobileTransactionCard = ({ transaction, onDelete, onEdit }: MobileTransactionCardProps) => {
  return (
    <div className="bg-gradient-to-r from-white to-slate-50 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 p-4 space-y-3">
      {/* Header with title and amount */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-800 text-base truncate">{transaction.description}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge 
              variant={transaction.type === 'income' ? 'default' : 'destructive'}
              className={`${transaction.type === 'income' 
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md' 
                : 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md'
              } font-semibold px-2 py-1 rounded-lg text-xs`}
            >
              {transaction.category}
            </Badge>
            {/* Indicador de parcelas */}
            {transaction.type === 'expense' && transaction.installments && transaction.installments > 1 && (
              <Badge 
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200 font-semibold px-2 py-1 rounded-lg text-xs"
              >
                1/{transaction.installments}x
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xl font-bold ${
              transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {transaction.type === 'income' ? '+' : '-'}R$ {
              // Para despesas parceladas, mostrar valor da parcela
              transaction.type === 'expense' && transaction.installments && transaction.installments > 1
                ? (transaction.amount / transaction.installments).toFixed(2)
                : transaction.amount.toFixed(2)
            }
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 p-2 rounded-xl transition-all duration-200 hover:scale-110 min-w-[40px]"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(transaction.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-xl transition-all duration-200 hover:scale-110 min-w-[40px]"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Footer with date and notes */}
      <div className="flex items-center justify-between gap-4 text-sm text-slate-600">
        <span className="flex items-center gap-2 font-medium">
          <Calendar className="w-4 h-4" />
          {new Date(transaction.date).toLocaleDateString('pt-BR')}
        </span>
        {transaction.notes && (
          <span className="text-xs bg-gradient-to-r from-slate-100 to-slate-200 px-2 py-1 rounded-lg font-medium text-slate-700 truncate max-w-[120px]">
            {transaction.notes}
          </span>
        )}
      </div>
    </div>
  );
};
