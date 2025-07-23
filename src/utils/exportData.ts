import { Transaction } from "@/types/Transaction";

/**
 * Converte um array de transações para formato CSV
 */
export const transactionsToCSV = (transactions: Transaction[]): string => {
  if (!transactions || transactions.length === 0) {
    return '';
  }

  // Cabeçalho CSV
  const headers = [
    'ID',
    'Tipo',
    'Valor',
    'Descrição',
    'Categoria',
    'Data',
    'Observações',
    'Método de Pagamento',
    'Parcelas',
    'Status de Recebimento',
    'Data Agendada',
    'ID do Cartão'
  ].join(',');

  // Linhas de dados
  const rows = transactions.map(t => {
    // Escapar campos que podem conter vírgulas
    const escapeField = (field: string | undefined) => {
      if (field === undefined || field === null) return '';
      return `"${String(field).replace(/"/g, '""')}"`;
    };

    return [
      t.id,
      t.type === 'income' ? 'Receita' : 'Despesa',
      t.amount,
      escapeField(t.description),
      escapeField(t.category),
      t.date,
      escapeField(t.notes),
      t.paymentMethod || '',
      t.installments || '',
      t.receivedStatus || '',
      t.scheduledDate || '',
      t.cardId || ''
    ].join(',');
  });

  return [headers, ...rows].join('\n');
};

/**
 * Exporta transações para um arquivo CSV
 */
export const exportTransactionsToCSV = (transactions: Transaction[]): void => {
  const csv = transactionsToCSV(transactions);
  
  // Criar blob e link para download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Criar elemento de link temporário
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `transacoes_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  // Adicionar ao DOM, clicar e remover
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};