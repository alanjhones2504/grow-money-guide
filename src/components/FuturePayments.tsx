import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  TrendingUp, 
  CreditCard,
  AlertCircle,
  BarChart3,
  Clock,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useFuturePayments } from "@/hooks/useFuturePayments";
import { Transaction } from "@/types/Transaction";
import { Card as CardType } from "@/types/Card";
import { memo, useState } from "react";

interface FuturePaymentsProps {
  transactions: Transaction[];
  cards: CardType[];
}

export const FuturePayments = memo(({ transactions, cards }: FuturePaymentsProps) => {
  const { 
    futureMonths, 
    totalFutureAmount, 
    averageMonthlyAmount, 
    highestMonth,
    totalInstallmentTransactions 
  } = useFuturePayments(transactions, cards);
  
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
  
  const toggleMonth = (monthKey: string) => {
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(monthKey)) {
      newExpanded.delete(monthKey);
    } else {
      newExpanded.add(monthKey);
    }
    setExpandedMonths(newExpanded);
  };

  if (futureMonths.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            Pagamentos Futuros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-4">
            <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl w-16 h-16 mx-auto flex items-center justify-center">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <p className="text-slate-600 font-medium text-lg">Nenhum pagamento futuro</p>
              <p className="text-slate-500 text-sm mt-2">Adicione compras parceladas para ver os próximos pagamentos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumo Geral */}
      <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <BarChart3 className="w-6 h-6" />
            </div>
            Resumo de Pagamentos Futuros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">R$ {totalFutureAmount.toFixed(2)}</div>
              <div className="text-blue-100 text-sm">Total a Pagar</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">R$ {averageMonthlyAmount.toFixed(2)}</div>
              <div className="text-blue-100 text-sm">Média Mensal</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totalInstallmentTransactions}</div>
              <div className="text-blue-100 text-sm">Compras Parceladas</div>
            </div>
          </div>
          
          {highestMonth && (
            <div className="mt-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>
                  Mês mais pesado: <strong>{highestMonth.month}</strong> - R$ {highestMonth.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detalhes por Mês */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            Cronograma de Pagamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {futureMonths.map((month, index) => {
              const monthKey = `${month.year}-${month.monthNumber}`;
              const isExpanded = expandedMonths.has(monthKey);
              
              return (
                <div 
                  key={monthKey}
                  className={`rounded-xl border-2 transition-all duration-200 ${
                    index === 0 
                      ? 'border-indigo-200 bg-indigo-50' 
                      : month.totalAmount > averageMonthlyAmount
                      ? 'border-orange-200 bg-orange-50'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  {/* Cabeçalho Clicável do Mês */}
                  <button
                    onClick={() => toggleMonth(monthKey)}
                    className="w-full p-4 flex items-center justify-between hover:bg-white/50 transition-colors duration-200 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        index === 0 
                          ? 'bg-indigo-500 text-white' 
                          : month.totalAmount > averageMonthlyAmount
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-500 text-white'
                      }`}>
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-slate-800 capitalize">
                          Fatura de {month.month}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {month.payments.length} pagamento{month.payments.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xl font-bold text-slate-800">
                          R$ {month.totalAmount.toFixed(2)}
                        </div>
                        <div className="flex gap-2 justify-end">
                          {index === 0 && (
                            <Badge variant="default" className="bg-indigo-500 text-white text-xs">
                              Próximo Mês
                            </Badge>
                          )}
                          {month.totalAmount > averageMonthlyAmount && index > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              Acima da Média
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="ml-2">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-600" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Lista de Pagamentos do Mês (Expansível) */}
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-3 border-t border-white/50">
                      <div className="pt-3">
                        {month.payments.map((payment) => (
                          <div 
                            key={`${payment.transactionId}-${payment.currentInstallment}`}
                            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm mb-3 last:mb-0"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-slate-800">
                                  {payment.description}
                                </h4>
                                <Badge variant="outline" className="text-xs">
                                  {payment.currentInstallment}/{payment.totalInstallments}
                                </Badge>
                              </div>
                              
                              {payment.cardName && (
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                  <CreditCard className="w-3 h-3" />
                                  <span>{payment.cardName} - {payment.cardBank}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="text-right">
                              <div className="font-bold text-slate-800">
                                R$ {payment.monthlyAmount.toFixed(2)}
                              </div>
                              <div className="text-xs text-slate-500">
                                parcela {payment.currentInstallment}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});