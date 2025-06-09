
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X, PlusCircle } from "lucide-react";
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm shadow-2xl border-0 animate-scale-in">
        <CardHeader className="pb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-between text-2xl font-bold">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <PlusCircle className="w-6 h-6" />
              </div>
              Nova Transação
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20 rounded-xl">
              <X className="w-5 h-5" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-lg font-semibold text-slate-700 mb-3 block">Tipo de Transação</Label>
              <RadioGroup
                value={type}
                onValueChange={(value) => {
                  setType(value as 'income' | 'expense');
                  setCategory(''); // Reset category when type changes
                }}
                className="flex gap-8 mt-3"
              >
                <div className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-transparent hover:border-emerald-200 transition-all duration-200">
                  <RadioGroupItem value="income" id="income" className="w-5 h-5" />
                  <Label htmlFor="income" className="text-emerald-700 font-bold text-lg cursor-pointer">💰 Receita</Label>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border-2 border-transparent hover:border-red-200 transition-all duration-200">
                  <RadioGroupItem value="expense" id="expense" className="w-5 h-5" />
                  <Label htmlFor="expense" className="text-red-700 font-bold text-lg cursor-pointer">💸 Despesa</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="amount" className="text-base font-semibold text-slate-700 mb-2 block">Valor</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0,00"
                  className="h-12 text-lg font-semibold rounded-xl border-2 border-slate-200 focus:border-indigo-400 bg-white/80 backdrop-blur-sm"
                  required
                />
              </div>
              <div>
                <Label htmlFor="date" className="text-base font-semibold text-slate-700 mb-2 block">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-12 text-lg rounded-xl border-2 border-slate-200 focus:border-indigo-400 bg-white/80 backdrop-blur-sm"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-base font-semibold text-slate-700 mb-2 block">Descrição</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Almoço no restaurante"
                className="h-12 text-lg rounded-xl border-2 border-slate-200 focus:border-indigo-400 bg-white/80 backdrop-blur-sm"
                required
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-base font-semibold text-slate-700 mb-2 block">Categoria</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="h-12 text-lg rounded-xl border-2 border-slate-200 focus:border-indigo-400 bg-white/80 backdrop-blur-sm">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm shadow-xl border-0 rounded-xl">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-lg p-3 rounded-lg hover:bg-slate-100">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes" className="text-base font-semibold text-slate-700 mb-2 block">Observações (opcional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Informações adicionais..."
                rows={3}
                className="text-lg rounded-xl border-2 border-slate-200 focus:border-indigo-400 bg-white/80 backdrop-blur-sm resize-none"
              />
            </div>

            <div className="flex gap-4 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                className="flex-1 h-12 text-lg font-semibold rounded-xl border-2 border-slate-300 hover:bg-slate-50 transition-all duration-200"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="flex-1 h-12 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Adicionar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
