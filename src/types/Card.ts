export interface Card {
  id: number;
  nome: string;
  banco: string;
  limite: string;
  diaVencimento: number; // Dia do mês que vence a fatura (1-31)
}