
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  notes?: string;
  paymentMethod?: 'pix' | 'card';
  installments?: number;
  receivedStatus?: 'received' | 'scheduled';
  scheduledDate?: string;
}
