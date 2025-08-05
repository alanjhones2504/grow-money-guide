
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Calendar, Receipt, Pencil } from "lucide-react";
import { Transaction } from "@/types/Transaction";
import { MobileTransactionCard } from "./MobileTransactionCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  showAll: boolean;
  updateTransaction?: (id: string, updated: Partial<Transaction>) => void;
}

export const TransactionList = ({ transactions, onDelete, showAll, updateTransaction }: TransactionListProps) => {
  const isMobile = useIsMobile();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const handleEditClick = (transaction: any) => {
    setEditingId(transaction.id);
    setEditForm({ ...transaction });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = () => {
    if (updateTransaction && editingId) {
      updateTransaction(editingId, editForm);
    }
    setEditingId(null);
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

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
          <div className="flex items-center gap-3 text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="truncate">
              {showAll ? 'Todas as Transações' : 'Transações Recentes'}
            </span>
          </div>
          {!showAll && transactions.length > 0 && (
            <Badge variant="secondary" className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 font-semibold px-2 sm:px-3 py-1 text-xs sm:text-sm">
              {transactions.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className={`${showAll ? 'h-96' : 'h-auto'} px-4 sm:px-6 pb-6`}>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id}>
                {editingId === transaction.id ? (
                  <div className="flex items-center justify-between p-5 bg-gradient-to-r from-white to-slate-50 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex-1">
                      <input
                        type="text"
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        className="font-bold text-slate-800 text-lg mb-2 w-full border rounded px-2 py-1"
                      />
                      <input
                        type="number"
                        name="amount"
                        value={editForm.amount}
                        onChange={handleEditChange}
                        className="text-2xl font-bold text-red-600 w-full border rounded px-2 py-1 mb-2"
                      />
                      <input
                        type="number"
                        name="installments"
                        value={editForm.installments || 1}
                        onChange={handleEditChange}
                        className="w-full border rounded px-2 py-1 mb-2"
                      />
                      {/* Adicione outros campos conforme necessário */}
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" className="bg-indigo-600 text-white" onClick={handleEditSave}>Salvar</Button>
                        <Button size="sm" variant="outline" onClick={handleEditCancel}>Cancelar</Button>
                      </div>
                    </div>
                  </div>
                ) : isMobile ? (
                  <MobileTransactionCard 
                    transaction={transaction} 
                    onDelete={onDelete}
                    onEdit={() => handleEditClick(transaction)}
                  />
                ) : (
                  <div className="flex items-center justify-between p-5 bg-gradient-to-r from-white to-slate-50 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 hover:scale-[1.02]">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-bold text-slate-800 text-lg">{transaction.description}</h3>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={transaction.type === 'income' ? 'default' : 'destructive'}
                            className={`${transaction.type === 'income' 
                              ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md' 
                              : 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md'
                            } font-semibold px-3 py-1 rounded-lg`}
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
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-2xl font-bold ${
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
                        onClick={() => handleEditClick(transaction)}
                        className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 p-3 rounded-xl transition-all duration-200 hover:scale-110"
                      >
                        <Pencil className="w-5 h-5" />
                      </Button>
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
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
