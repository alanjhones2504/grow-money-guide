import { useMemo } from 'react';
import { Card } from '@/types/Card';
import { Transaction } from '@/types/Transaction';

interface DailyGoal {
  cardId: number;
  cardName: string;
  banco: string;
  totalAmount: number;
  daysUntilDue: number;
  dailyGoal: number;
  dueDate: Date;
  isOverdue: boolean;
}

interface DailyGoalsSummary {
  goals: DailyGoal[];
  totalDailyGoal: number;
  nextDueDate: Date | null;
  urgentGoals: DailyGoal[]; // Vencem em menos de 3 dias
}

export const useDailyGoals = (cards: Card[], transactions: Transaction[]) => {
  return useMemo(() => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const goals: DailyGoal[] = cards.map(card => {
      // Calcular total gasto no cartão este mês
      const totalSpent = transactions
        .filter(t => 
          t.type === 'expense' && 
          t.paymentMethod === 'card' && 
          t.cardId === String(card.id)
        )
        .reduce((sum, t) => {
          // Para parcelas, somar apenas o valor da parcela mensal
          const monthlyAmount = t.installments && t.installments > 1 
            ? t.amount / t.installments 
            : t.amount;
          return sum + monthlyAmount;
        }, 0);

      // Calcular data de vencimento
      let dueDate = new Date(currentYear, currentMonth, card.diaVencimento);
      
      // Se o dia já passou este mês, considerar o próximo mês
      if (card.diaVencimento <= currentDay) {
        dueDate = new Date(currentYear, currentMonth + 1, card.diaVencimento);
      }

      // Calcular dias até o vencimento
      const timeDiff = dueDate.getTime() - today.getTime();
      const daysUntilDue = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      // Calcular meta diária
      const dailyGoal = daysUntilDue > 0 ? totalSpent / daysUntilDue : totalSpent;

      return {
        cardId: card.id,
        cardName: card.nome,
        banco: card.banco,
        totalAmount: totalSpent,
        daysUntilDue: Math.max(0, daysUntilDue),
        dailyGoal: Math.max(0, dailyGoal),
        dueDate,
        isOverdue: daysUntilDue < 0
      };
    }).filter(goal => goal.totalAmount > 0); // Só mostrar cartões com gastos

    // Calcular meta diária total
    const totalDailyGoal = goals.reduce((sum, goal) => sum + goal.dailyGoal, 0);

    // Encontrar próxima data de vencimento
    const nextDueDate = goals.length > 0 
      ? goals.reduce((earliest, goal) => 
          goal.dueDate < earliest ? goal.dueDate : earliest, 
          goals[0].dueDate
        )
      : null;

    // Metas urgentes (vencem em menos de 3 dias)
    const urgentGoals = goals.filter(goal => goal.daysUntilDue <= 3 && goal.daysUntilDue > 0);

    return {
      goals: goals.sort((a, b) => a.daysUntilDue - b.daysUntilDue), // Ordenar por urgência
      totalDailyGoal,
      nextDueDate,
      urgentGoals
    };
  }, [cards, transactions]);
};

// Hook para calcular progresso diário
export const useDailyProgress = (transactions: Transaction[], dailyGoal: number) => {
  return useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Receitas de hoje
    const todayIncome = transactions
      .filter(t => 
        t.type === 'income' && 
        t.date === todayStr
      )
      .reduce((sum, t) => sum + t.amount, 0);

    // Progresso em porcentagem
    const progressPercent = dailyGoal > 0 ? (todayIncome / dailyGoal) * 100 : 0;

    // Valor restante para atingir a meta
    const remaining = Math.max(0, dailyGoal - todayIncome);

    return {
      todayIncome,
      dailyGoal,
      progressPercent: Math.min(100, progressPercent),
      remaining,
      isCompleted: todayIncome >= dailyGoal,
      isOverAchieved: todayIncome > dailyGoal
    };
  }, [transactions, dailyGoal]);
};