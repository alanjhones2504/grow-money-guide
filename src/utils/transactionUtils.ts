
import { Transaction } from "@/pages/Index";

export const calculateTotals = (transactions: Transaction[]) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return {
    income: totalIncome,
    expenses: totalExpenses,
    balance: totalIncome - totalExpenses
  };
};
