import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trash2 } from "lucide-react";
import { Transaction } from "@/types/Transaction";

interface MobileTransactionCardProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

export const MobileTransactionCard = ({ transaction, onDelete }: MobileTransactionCardProps) => {
  return (
    <div className="bg-gradient-to-r from-white to-slate-50 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 p-4 space-y-3">
      {/* Header with title and amount */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-800 text-base truncate">{transaction.description}</h3>
          <Badge 
            variant={transaction.type === 'income' ? 'default' : 'destructive'}
            className={`${transaction.type === 'income' 
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md' 
              : 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md'
            } font-semibold px-2 py-1 rounded-lg text-xs mt-1`}
          >
            {transaction.category}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xl font-bold ${
              transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toFixed(2)}
          </span>
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
