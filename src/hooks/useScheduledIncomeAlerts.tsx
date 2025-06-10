
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Transaction } from "@/pages/Index";

export const useScheduledIncomeAlerts = (
  transactions: Transaction[], 
  markAsReceived: (id: string) => void
) => {
  const { toast } = useToast();

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    transactions.forEach(transaction => {
      if (transaction.type === 'income' && transaction.receivedStatus === 'scheduled' && transaction.scheduledDate) {
        const scheduled = new Date(transaction.scheduledDate);
        scheduled.setHours(0, 0, 0, 0);

        if (scheduled <= today) {
          toast({
            title: "Receita Agendada Vencida!",
            description: `Você recebeu R$ ${transaction.amount.toFixed(2)} (${transaction.description})?`,
            action: (
              <Button 
                variant="outline" 
                onClick={() => markAsReceived(transaction.id)}
              >
                Marcar como Recebido
              </Button>
            ),
            duration: 900000 // Long duration to allow user interaction
          });
        }
      }
    });
  }, [transactions, toast, markAsReceived]);
};
