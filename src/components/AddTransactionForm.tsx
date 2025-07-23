import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, PlusCircle, DollarSign, Calendar, FileText, Tag, StickyNote, CreditCard, Smartphone, AlertCircle } from "lucide-react";
import { Transaction } from "@/types/Transaction";
import { transactionSchema } from "@/schemas/transaction.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface Card {
  id: number;
  nome: string;
  banco: string;
  limite: string;
  fechamento: string;
}

interface AddTransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
  onClose: () => void;
  cards: Card[];
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

export const AddTransactionForm = ({ onAdd, onClose, cards }: AddTransactionFormProps) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const today = new Date().toISOString().split('T')[0];
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue,
    watch,
    reset
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      amount: undefined,
      description: '',
      category: '',
      date: today,
      notes: '',
      paymentMethod: undefined,
      installments: 1,
      receivedStatus: undefined,
      scheduledDate: today,
      cardId: ''
    }
  });

  // Watch values for conditional rendering
  const watchPaymentMethod = watch('paymentMethod');
  const watchReceivedStatus = watch('receivedStatus');

  // Handle type change
  const handleTypeChange = (newType: 'income' | 'expense') => {
    setType(newType);
    setValue('type', newType);
    setValue('category', '');
    setValue('paymentMethod', undefined);
    setValue('receivedStatus', undefined);
    setValue('cardId', '');
  };

  const onSubmit = (data: any) => {
    try {
      // Prepare transaction data
      const newTransaction: Omit<Transaction, 'id'> = {
        type: data.type,
        amount: Number(data.amount),
        description: data.description,
        category: data.category,
        date: data.date,
        notes: data.notes || undefined,
      };

      // Add expense-specific fields
      if (data.type === 'expense') {
        if (data.paymentMethod) {
          newTransaction.paymentMethod = data.paymentMethod;
        }
        if (data.paymentMethod === 'card' && data.installments) {
          newTransaction.installments = Number(data.installments);
        }
        if (data.paymentMethod === 'card' && data.cardId) {
          newTransaction.cardId = data.cardId;
        }
      } 
      // Add income-specific fields
      else if (data.type === 'income') {
        if (data.receivedStatus) {
          newTransaction.receivedStatus = data.receivedStatus;
        }
        if (data.receivedStatus === 'scheduled' && data.scheduledDate) {
          newTransaction.scheduledDate = data.scheduledDate;
        }
      }

      onAdd(newTransaction);
      reset();
      
    } catch (error) {
      console.error('Erro ao criar transação:', error);
    }
  };

  // A função handleTypeChange já foi definida acima

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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
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
                      onChange={() => handleTypeChange('income')}
                      className="peer sr-only"
                      {...register('type')}
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
                      onChange={() => handleTypeChange('expense')}
                      className="peer sr-only"
                      {...register('type')}
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
                    Valor *
                  </Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      aria-label="Valor da transação"
                      aria-required="true"
                      aria-invalid={errors.amount ? "true" : "false"}
                      aria-describedby={errors.amount ? "amount-error" : undefined}
                      className={`h-9 text-base font-semibold rounded-xl border-2 focus:border-indigo-400 bg-white/90 backdrop-blur-sm shadow-sm pl-8 transition-all duration-200 ${errors.amount ? 'border-red-500' : 'border-slate-200'}`}
                      {...register('amount', { valueAsNumber: true })}
                    />
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-500 font-bold">
                      R$
                    </div>
                  </div>
                  {errors.amount && (
                    <p id="amount-error" className="text-red-500 text-xs flex items-center mt-1" role="alert">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.amount.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="date" className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    Data
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    aria-label="Data da transação"
                    aria-required="true"
                    aria-invalid={errors.date ? "true" : "false"}
                    aria-describedby={errors.date ? "date-error" : undefined}
                    className={`h-9 text-base rounded-xl border-2 focus:border-indigo-400 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200 ${errors.date ? 'border-red-500' : 'border-slate-200'}`}
                    {...register('date')}
                  />
                  {errors.date && (
                    <p id="date-error" className="text-red-500 text-xs flex items-center mt-1" role="alert">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.date.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Descrição */}
              <div className="space-y-1">
                <Label htmlFor="description" className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Descrição *
                </Label>
                <Input
                  id="description"
                  placeholder="Ex: Almoço no restaurante, Salário mensal..."
                  aria-label="Descrição da transação"
                  aria-required="true"
                  aria-invalid={errors.description ? "true" : "false"}
                  aria-describedby={errors.description ? "description-error" : undefined}
                  className={`h-9 text-base rounded-xl border-2 focus:border-indigo-400 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200 ${errors.description ? 'border-red-500' : 'border-slate-200'}`}
                  {...register('description')}
                />
                {errors.description && (
                  <p id="description-error" className="text-red-500 text-xs flex items-center mt-1" role="alert">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Categoria */}
              <div className="space-y-1">
                <Label htmlFor="category" className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-600" />
                  Categoria *
                </Label>
                <Select onValueChange={(value) => setValue('category', value)}>
                  <SelectTrigger 
                    className={`h-9 text-base rounded-xl border-2 focus:border-indigo-400 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200 ${errors.category ? 'border-red-500' : 'border-slate-200'}`}
                    aria-label="Categoria da transação"
                    aria-required="true"
                    aria-invalid={errors.category ? "true" : "false"}
                    aria-describedby={errors.category ? "category-error" : undefined}
                  >
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/98 backdrop-blur-xl shadow-2xl border-0 rounded-xl max-h-60 z-[60]">
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
                <input type="hidden" {...register('category')} />
                {errors.category && (
                  <p id="category-error" className="text-red-500 text-xs flex items-center mt-1" role="alert">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Observações */}
              <div className="space-y-1">
                <Label htmlFor="notes" className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <StickyNote className="w-4 h-4 text-indigo-600" />
                  Observações <span className="text-slate-500 font-normal text-xs">(opcional)</span>
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Informações adicionais sobre a transação..."
                  rows={2}
                  className="text-sm rounded-xl border-2 border-slate-200 focus:border-indigo-400 bg-white/90 backdrop-blur-sm resize-none shadow-sm transition-all duration-200"
                  {...register('notes')}
                />
              </div>

              {/* Status do Recebimento (apenas para receitas) */}
              {type === 'income' && (
                <div className="space-y-1">
                  <Label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-indigo-600" />
                    Status do Recebimento
                  </Label>
                  <Select onValueChange={(value) => setValue('receivedStatus', value as 'received' | 'scheduled')}>
                    <SelectTrigger className="h-9 text-base rounded-xl border-2 border-slate-200 focus:border-indigo-400 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/98 backdrop-blur-xl shadow-2xl border-0 rounded-xl max-h-60 z-[60]">
                      <SelectItem value="received" className="text-sm p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-all duration-200 m-1">
                        Recebido na Hora
                      </SelectItem>
                      <SelectItem value="scheduled" className="text-sm p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-all duration-200 m-1">
                        Agendado para outro dia
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <input type="hidden" {...register('receivedStatus')} />
                  
                  {watchReceivedStatus === 'scheduled' && (
                    <div className="space-y-1 mt-3">
                      <Label htmlFor="scheduledDate" className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        Data Agendada
                      </Label>
                      <Input
                        id="scheduledDate"
                        type="date"
                        className="h-9 text-base rounded-xl border-2 border-slate-200 focus:border-indigo-400 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200"
                        {...register('scheduledDate')}
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
                    Método de Pagamento
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className={`p-2 rounded-xl border-2 transition-all duration-200 ${watchPaymentMethod === 'pix' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white'}`}
                      onClick={() => setValue('paymentMethod', 'pix')}
                    >
                      PIX
                    </button>
                    <button
                      type="button"
                      className={`p-2 rounded-xl border-2 transition-all duration-200 ${watchPaymentMethod === 'card' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'}`}
                      onClick={() => setValue('paymentMethod', 'card')}
                    >
                      Cartão
                    </button>
                  </div>
                  <input type="hidden" {...register('paymentMethod')} />
                </div>
              )}
              
              {/* Seleção de Cartão */}
              {type === 'expense' && watchPaymentMethod === 'card' && (
                <div className="space-y-1">
                  <Label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                    Selecione o Cartão
                  </Label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    {...register('cardId')}
                  >
                    <option value="">Selecione...</option>
                    {cards.map(card => (
                      <option key={card.id} value={card.id.toString()}>
                        {card.nome} - {card.banco}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Parcelas (apenas para despesas) */}
              {type === 'expense' && watchPaymentMethod === 'card' && (
                <div className="space-y-1">
                  <Label htmlFor="installments" className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-indigo-600" />
                    Parcelas
                  </Label>
                  <Input
                    id="installments"
                    type="number"
                    min="1"
                    placeholder="1"
                    className="h-9 text-base rounded-xl border-2 border-slate-200 focus:border-indigo-400 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200"
                    {...register('installments', { valueAsNumber: true })}
                  />
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