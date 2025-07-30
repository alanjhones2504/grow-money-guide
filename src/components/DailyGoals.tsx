import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  DollarSign,
  Check,
  Undo2
} from "lucide-react";
import { useDailyGoals, useDailyProgress } from "@/hooks/useDailyGoals";
import { Card as CardType } from "@/types/Card";
import { Transaction } from "@/types/Transaction";
import { memo } from "react";

interface DailyGoalsProps {
  cards: CardType[];
  transactions: Transaction[];
  onMarkAsPaid: (cardId: number) => void;
  onMarkAsUnpaid: (cardId: number) => void;
}

export const DailyGoals = memo(({ cards, transactions, onMarkAsPaid, onMarkAsUnpaid }: DailyGoalsProps) => {
  const { goals, totalDailyGoal, nextDueDate, urgentGoals } = useDailyGoals(cards, transactions);
  const progress = useDailyProgress(transactions, totalDailyGoal);

  if (goals.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            Metas Diárias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-4">
            <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl w-16 h-16 mx-auto flex items-center justify-center">
              <Target className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <p className="text-slate-600 font-medium text-lg">Nenhuma meta ativa</p>
              <p className="text-slate-500 text-sm mt-2">Adicione gastos nos cartões para ver suas metas diárias</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumo da Meta Diária */}
      <Card className={`${
        progress.isCompleted 
          ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
          : urgentGoals.length > 0
          ? 'bg-gradient-to-br from-orange-500 to-red-600'
          : 'bg-gradient-to-br from-blue-500 to-indigo-600'
      } text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-xl font-semibold">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                {progress.isCompleted ? (
                  <CheckCircle className="w-6 h-6" />
                ) : urgentGoals.length > 0 ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : (
                  <Target className="w-6 h-6" />
                )}
              </div>
              Meta Diária
            </div>
            {urgentGoals.length > 0 && (
              <Badge variant="destructive" className="bg-red-700 text-white">
                {urgentGoals.length} Urgente{urgentGoals.length > 1 ? 's' : ''}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">
                  R$ {totalDailyGoal.toFixed(2)}
                </div>
                <div className="text-white/80 text-sm">
                  {progress.isCompleted ? 'Meta atingida!' : 'Meta de hoje'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">
                  R$ {progress.todayIncome.toFixed(2)}
                </div>
                <div className="text-white/80 text-sm">
                  Ganho hoje ({progress.progressPercent.toFixed(0)}%)
                </div>
              </div>
            </div>
            
            <Progress 
              value={progress.progressPercent} 
              className="h-3 bg-white/20"
            />
            
            {!progress.isCompleted && (
              <div className="flex items-center gap-2 text-sm text-white/90">
                <DollarSign className="w-4 h-4" />
                <span>Faltam R$ {progress.remaining.toFixed(2)} para atingir a meta</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detalhes por Cartão */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            Detalhes por Cartão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goals.map(goal => (
              <div 
                key={goal.cardId} 
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  goal.daysUntilDue <= 3 
                    ? 'border-red-200 bg-red-50' 
                    : goal.daysUntilDue <= 7
                    ? 'border-orange-200 bg-orange-50'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800">
                      {goal.cardName} - {goal.banco}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-600">
                        {goal.daysUntilDue === 0 ? 'Vence hoje!' : 
                         goal.daysUntilDue === 1 ? 'Vence amanhã' :
                         `Vence em ${goal.daysUntilDue} dias`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-800">
                        R$ {goal.dailyGoal.toFixed(2)}/dia
                      </div>
                      <div className="text-sm text-slate-600">
                        Total: R$ {goal.totalAmount.toFixed(2)}
                      </div>
                    </div>
                    
                    {/* Botão Marcar como Pago */}
                    <button
                      onClick={() => onMarkAsPaid(goal.cardId)}
                      className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg group"
                      title="Marcar como pago"
                    >
                      <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Vencimento: {goal.dueDate.toLocaleDateString('pt-BR')}</span>
                  {goal.daysUntilDue <= 3 && (
                    <Badge variant="destructive" className="text-xs">
                      Urgente
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cartões Pagos */}
      {cards.filter(card => card.isPaid).length > 0 && (
        <Card className="bg-green-50 border-green-200 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-green-700">
              <div className="p-2 bg-green-500 rounded-xl shadow-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              Cartões Pagos Este Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cards.filter(card => card.isPaid).map(card => (
                <div 
                  key={card.id} 
                  className="p-4 bg-white rounded-xl border-2 border-green-200 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-bold text-slate-800">
                      {card.nome} - {card.banco}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">
                        Pago em {card.paidDate ? new Date(card.paidDate).toLocaleDateString('pt-BR') : 'hoje'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Botão para desmarcar */}
                  <button
                    onClick={() => onMarkAsUnpaid(card.id)}
                    className="p-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg group"
                    title="Desmarcar como pago"
                  >
                    <Undo2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
});