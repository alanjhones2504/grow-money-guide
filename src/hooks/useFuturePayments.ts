import { useMemo } from 'react';
import { Transaction } from '@/types/Transaction';
import { Card } from '@/types/Card';

interface FuturePayment {
  transactionId: string;
  description: string;
  monthlyAmount: number;
  currentInstallment: number;
  totalInstallments: number;
  cardId?: string;
  cardName?: string;
  cardBank?: string;
}

interface MonthlyPayments {
  month: string;
  year: number;
  monthNumber: number;
  payments: FuturePayment[];
  totalAmount: number;
}

export const useFuturePayments = (transactions: Transaction[], cards: Card[]) => {
  return useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Filtrar apenas transações parceladas (installments > 1)
    const installmentTransactions = transactions.filter(t => 
      t.type === 'expense' && 
      t.installments && 
      t.installments > 1
    );

    // Criar mapa de cartões para facilitar busca
    const cardMap = new Map(cards.map(card => [card.id.toString(), card]));

    // Calcular pagamentos futuros para os próximos 12 meses
    const futureMonths: MonthlyPayments[] = [];

    for (let i = 1; i <= 12; i++) {
      const futureDate = new Date(currentYear, currentMonth + i, 1);
      const monthNumber = futureDate.getMonth();
      const year = futureDate.getFullYear();
      const monthName = futureDate.toLocaleDateString('pt-BR', { 
        month: 'long', 
        year: 'numeric' 
      });

      const monthPayments: FuturePayment[] = [];

      installmentTransactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date);
        const transactionMonth = transactionDate.getMonth();
        const transactionYear = transactionDate.getFullYear();

        // Calcular em qual parcela estaremos no mês futuro
        const monthsDiff = (year - transactionYear) * 12 + (monthNumber - transactionMonth);
        const installmentNumber = monthsDiff + 1;

        // Verificar se ainda há parcelas a pagar neste mês
        if (installmentNumber > 0 && installmentNumber <= (transaction.installments || 1)) {
          const card = transaction.cardId ? cardMap.get(transaction.cardId) : null;
          
          monthPayments.push({
            transactionId: transaction.id,
            description: transaction.description,
            monthlyAmount: transaction.amount / (transaction.installments || 1),
            currentInstallment: installmentNumber,
            totalInstallments: transaction.installments || 1,
            cardId: transaction.cardId,
            cardName: card?.nome,
            cardBank: card?.banco
          });
        }
      });

      // Só adicionar meses que têm pagamentos
      if (monthPayments.length > 0) {
        const totalAmount = monthPayments.reduce((sum, payment) => sum + payment.monthlyAmount, 0);
        
        futureMonths.push({
          month: monthName,
          year,
          monthNumber,
          payments: monthPayments.sort((a, b) => b.monthlyAmount - a.monthlyAmount), // Ordenar por valor
          totalAmount
        });
      }
    }

    // Calcular estatísticas
    const totalFutureAmount = futureMonths.reduce((sum, month) => sum + month.totalAmount, 0);
    const averageMonthlyAmount = futureMonths.length > 0 ? totalFutureAmount / futureMonths.length : 0;
    const highestMonth = futureMonths.reduce((max, month) => 
      month.totalAmount > max.totalAmount ? month : max, 
      futureMonths[0] || { totalAmount: 0 }
    );

    return {
      futureMonths,
      totalFutureAmount,
      averageMonthlyAmount,
      highestMonth,
      totalInstallmentTransactions: installmentTransactions.length
    };
  }, [transactions, cards]);
};