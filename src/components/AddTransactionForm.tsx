import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, PlusCircle, DollarSign, Calendar, FileText, Tag, StickyNote, CreditCard, Smartphone } from "lucide-react";
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
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | ''>('');
  const [installments, setInstallments] = useState<string>('1');
  const [receivedStatus, setReceivedStatus] = useState<'received' | 'scheduled' | ''>('');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !category) {
      return;
    }

    const newTransaction: Omit<Transaction, 'id'> = {
      type,
      amount: parseFloat(amount),
      description,
      category,
      date,
      notes,
    };

    if (type === 'expense') {
      if (paymentMethod === 'pix' || paymentMethod === 'card') {
        newTransaction.paymentMethod = paymentMethod;
      }
      if (paymentMethod === 'card' && installments) {
        newTransaction.installments = parseInt(installments);
      }
    } else if (type === 'income') {
      if (receivedStatus) {
        newTransaction.receivedStatus = receivedStatus;
      }
      if (receivedStatus === 'scheduled' && scheduledDate) {
        newTransaction.date = scheduledDate;
      }
    }

    onAdd(newTransaction);

    // Reset form
    setAmount('');
    setDescription('');
    setCategory('');
    setNotes('');
    setPaymentMethod('');
    setInstallments('1');
    setReceivedStatus('');
    setScheduledDate(new Date().toISOString().split('T')[0]);
  };

  const categories = type === 'income' ? incomeCategories : expenseCategories;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-2xl bg-white/98 backdrop-blur-xl shadow-2xl border-0 animate-scale-in overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <CardHeader className="pb-4 bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-600 text-white relative overflow-hidden flex-shrink-0">
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
        <div className="flex-1 min-h-0 overflow-auto">
          <CardContent className="p-2 bg-gradient-to-br from-slate-50 to-white">
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Tipo de Transação */}
              <div className="space-y-1">
                <Label className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-600" />
                  Tipo de Transação
                </Label>
                <div className="grid grid-cols-2 gap-2">
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
                      className="flex items-center justify-center space-x-2 p-2 rounded-xl bg-gradient-to-br from-emerald-50 to-green-100 border-2 border-emerald-200 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 peer-checked:border-emerald-500 peer-checked:shadow-xl peer-checked:bg-gradient-to-br peer-checked:from-emerald-100 peer-checked:to-green-200 text-sm"
                    >
                      <div className="text-lg">💰</div>
                      <div className="text-center">
                        <div className="text-emerald-700 font-semibold">Receita</div>
                        <div className="text-emerald-600 text-xs">Ganhos</div>
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
                      className="flex items-center justify-center space-x-2 p-2 rounded-xl bg-gradient-to-br from-red-50 to-rose-100 border-2 border-red-200 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 peer-checked:border-red-500 peer-checked:shadow-xl peer-checked:bg-gradient-to-br peer-checked:from-red-100 peer-checked:to-rose-200 text-sm"
                    >
                      <div className="text-lg">💸</div>
                      <div className="text-center">
                        <div className="text-red-700 font-semibold">Despesa</div>
                        <div className="text-red-600 text-xs">Dinheiro que sai</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Valor e Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="amount" className="text-sm font-semibold text-slate-800 flex items-center gap-2">
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
                      className="h-9 text-base font-semibold rounded-xl border-2 border-slate-200 focus:border-indigo-400 bg-white/90 backdrop-blur-sm shadow-sm pl-8 transition-all duration-200"
                      required
                    />
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-500 font-bold">
                      R$
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="date" className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    Data
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-9 text-base rounded-xl border-2 border-slate-200 focus:border-indigo-400 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Descrição */}
              <div className="space-y-1">
                <Label htmlFor="description" className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Descrição
                </Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Almoço no restaurante, Salário mensal..."
                  className="h-9 text-base rounded-xl border-2 border-slate-200 focus:border-indigo-400 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200"
                  required
                />
              </div>

              {/* Categoria */}
              <div className="space-y-1">
                <Label htmlFor="category" className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-600" />
                  Categoria
                </Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="h-9 text-base rounded-xl border-2 border-slate-200 focus:border-indigo-400 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/98 backdrop-blur-xl shadow-2xl border-0 rounded-xl max-h-60">
                    {categories.map((cat) => (
                      <SelectItem 
                        key={cat} 
                        value={cat} 
                        className="text-sm p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-all duration-200 m-1"
                      >
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Observações */}
              <div className="space-y-1">
                <Label htmlFor="notes" className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <StickyNote className="w-4 h-4 text-indigo-600" />
                  Observações <span className="text-slate-500 font-normal text-xs">(opcional)</span>
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Informações adicionais sobre a transação..."
                  rows={2}
                  className="text-sm rounded-xl border-2 border-slate-200 focus:border-indigo-400 bg-white/90 backdrop-blur-sm resize-none shadow-sm transition-all duration-200"
                />
              </div>

              {/* Status do Recebimento (apenas para receitas) */}
              {type === 'income' && (
                <div className="space-y-1">
                  <Label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-indigo-600" />
                    Status do Recebimento
                  </Label>
                  <Select value={receivedStatus} onValueChange={(value) => setReceivedStatus(value as 'received' | 'scheduled' | '')}>
                    <SelectTrigger className="h-9 text-base rounded-xl border-2 border-slate-200 focus:border-indigo-400 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/98 backdrop-blur-xl shadow-2xl border-0 rounded-xl max-h-60">
                      <SelectItem value="received" className="text-sm p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-all duration-200 m-1">
                        Recebido na Hora
                      </SelectItem>
                      <SelectItem value="scheduled" className="text-sm p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-all duration-200 m-1">
                        Agendado para outro dia
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {receivedStatus === 'scheduled' && (
                    <div className="space-y-1 mt-3">
                      <Label htmlFor="scheduledDate" className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        Data Agendada
                      </Label>
                      <Input
                        id="scheduledDate"
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="h-9 text-base rounded-xl border-2 border-slate-200 focus:border-indigo-400 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200"
                        required
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Forma de Pagamento e Parcelas (apenas para despesas) */}
              {type === 'expense' && (
                <div className="space-y-1">
                  <Label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                    Forma de Pagamento
                  </Label>
                  <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'pix' | 'card' | '')}>
                    <SelectTrigger className="h-9 text-base rounded-xl border-2 border-slate-200 focus:border-indigo-400 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200">
                      <SelectValue placeholder="Selecione a forma de pagamento" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/98 backdrop-blur-xl shadow-2xl border-0 rounded-xl max-h-60">
                      <SelectItem value="pix" className="text-sm p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-all duration-200 m-1">
                        <span className="flex items-center gap-2"><Smartphone className="w-4 h-4" /> Pix</span>
                      </SelectItem>
                      <SelectItem value="card" className="text-sm p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-all duration-200 m-1">
                        <span className="flex items-center gap-2"><CreditCard className="w-4 h-4" /> Cartão</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {paymentMethod === 'card' && (
                    <div className="space-y-1 mt-3">
                      <Label htmlFor="installments" className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-indigo-600" />
                        Parcelas
                      </Label>
                      <Input
                        id="installments"
                        type="number"
                        min="1"
                        value={installments}
                        onChange={(e) => setInstallments(e.target.value)}
                        placeholder="1"
                        className="h-9 text-base rounded-xl border-2 border-slate-200 focus:border-indigo-400 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Botões */}
              <div className="flex gap-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose} 
                  className="flex-1 h-8 text-sm font-semibold rounded-xl border-2 border-slate-300 hover:bg-slate-100 hover:border-slate-400 transition-all duration-300 shadow-sm"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 h-8 text-sm font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-700 text-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </form>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};
