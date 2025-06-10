import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, PlusCircle, DollarSign, Calendar, FileText, Tag, StickyNote } from "lucide-react";
import { Transaction } from "@/pages/Index";

interface AddTransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
  onClose: () => void;
}

const incomeCategories = [
  "Salário",
  "Freelance",
  "Investimentos",
  "Presente",
  "Outros"
];

const expenseCategories = [
  "Alimentação",
  "Moradia",
  "Transporte",
  "Lazer",
  "Contas",
  "Saúde",
  "Educação",
  "Vestuário",
  "Outros"
];

export const AddTransactionForm = ({ onAdd, onClose }: AddTransactionFormProps) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !category) {
      return;
    }

    onAdd({
      type,
      amount: parseFloat(amount),
      description,
      category,
      date,
      notes
    });

    // Reset form
    setAmount('');
    setDescription('');
    setCategory('');
    setNotes('');
  };

  const categories = type === 'income' ? incomeCategories : expenseCategories;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-2xl bg-white/98 backdrop-blur-xl shadow-2xl border-0 animate-scale-in overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <CardHeader className="pb-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-600 text-white relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <CardTitle className="flex items-center justify-between text-xl font-bold relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm shadow-lg">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Nova Transação</h2>
                <p className="text-white/80 text-sm font-normal mt-1">
                  Registre uma nova receita ou despesa
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="text-white hover:bg-white/20 rounded-xl transition-all duration-200 p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1">
          <CardContent className="p-6 bg-gradient-to-br from-slate-50 to-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tipo de Transação */}
              <div className="space-y-3">
                <Label className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-600" />
                  Tipo de Transação
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type="radio"
                      id="income"
                      value="income"
                      checked={type === 'income'}
                      onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor="income"
                      className="flex items-center justify-center space-x-2 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-green-100 border-2 border-emerald-200 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 peer-checked:border-emerald-500 peer-checked:shadow-xl peer-checked:bg-gradient-to-br peer-checked:from-emerald-100 peer-checked:to-green-200"
                    >
                      <div className="text-xl">💰</div>
                      <div className="text-center">
                        <div className="text-emerald-700 font-bold">Receita</div>
                        <div className="text-emerald-600 text-xs">Dinheiro que entra</div>
                      </div>
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="radio"
                      id="expense"
                      value="expense"
                      checked={type === 'expense'}
                      onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor="expense"
                      className="flex items-center justify-center space-x-2 p-4 rounded-xl bg-gradient-to-br from-red-50 to-rose-100 border-2 border-red-200 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 peer-checked:border-red-500 peer-checked:shadow-xl peer-checked:bg-gradient-to-br peer-checked:from-red-100 peer-checked:to-rose-200"
                    >
                      <div className="text-xl">💸</div>
                      <div className="text-center">
                        <div className="text-red-700 font-bold">Despesa</div>
                        <div className="text-red-600 text-xs">Dinheiro que sai</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Valor e Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-indigo-600" />
                    Valor
                  </Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0,00"
                      className="h-12 text-lg font-bold rounded-xl border-2 border-slate-200 focus:border-indigo-400 bg-white/90 backdrop-blur-sm shadow-sm pl-10 transition-all duration-200"
                      required
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-bold">
                      R$
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    Data
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-12 text-base rounded-xl border-2 border-slate-200 focus:border-indigo-400 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Descrição
                </Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Almoço no restaurante, Salário mensal..."
                  className="h-12 text-base rounded-xl border-2 border-slate-200 focus:border-indigo-400 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200"
                  required
                />
              </div>

              {/* Categoria */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-600" />
                  Categoria
                </Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="h-12 text-base rounded-xl border-2 border-slate-200 focus:border-indigo-400 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/98 backdrop-blur-xl shadow-2xl border-0 rounded-xl max-h-60">
                    {categories.map((cat) => (
                      <SelectItem 
                        key={cat} 
                        value={cat} 
                        className="text-base p-3 rounded-lg hover:bg-slate-100 cursor-pointer transition-all duration-200 m-1"
                      >
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Observações */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <StickyNote className="w-4 h-4 text-indigo-600" />
                  Observações <span className="text-slate-500 font-normal text-sm">(opcional)</span>
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Informações adicionais sobre a transação..."
                  rows={3}
                  className="text-base rounded-xl border-2 border-slate-200 focus:border-indigo-400 bg-white/90 backdrop-blur-sm resize-none shadow-sm transition-all duration-200"
                />
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose} 
                  className="flex-1 h-12 text-base font-bold rounded-xl border-2 border-slate-300 hover:bg-slate-100 hover:border-slate-400 transition-all duration-300 shadow-sm"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 h-12 text-base font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-700 text-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Adicionar Transação
                </Button>
              </div>
            </form>
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
};
