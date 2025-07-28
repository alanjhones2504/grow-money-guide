import { AddTransactionForm } from "@/components/AddTransactionForm";
import { useNavigate } from "react-router-dom";
import { Transaction } from "@/types/Transaction";
import { useCards } from "@/hooks/useCards";
import { useTransactions } from "@/hooks/useTransactions";

function AddExpense() {
  const navigate = useNavigate();
  const { cards } = useCards();
  const { addTransaction } = useTransactions();

  const handleAdd = (transaction: Omit<Transaction, 'id'>) => {
    addTransaction(transaction);
    navigate('/');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Adicionar Despesa</h1>
      <AddTransactionForm 
        onAdd={handleAdd} 
        onClose={() => navigate('/')} 
        cards={cards} 
        initialType="expense"
      />
    </div>
  );
}

export default AddExpense;