export interface Card {
  id: number;
  nome: string;
  banco: string;
  limite: string;
  diaVencimento: number; // Dia do mês que vence a fatura (1-31)
  diaFechamento: number; // Dia do mês que fecha a fatura (1-31)
  isPaid?: boolean; // Se a fatura do mês atual foi paga
  paidDate?: string; // Data que foi marcada como paga
}