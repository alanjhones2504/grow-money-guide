import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Transaction } from "@/types/Transaction";
import { exportTransactionsToCSV } from "@/utils/exportData";
import { useToast } from "@/hooks/use-toast";
import { memo } from "react";

interface ExportButtonProps {
  transactions: Transaction[];
}

export const ExportButton = memo(({ transactions }: ExportButtonProps) => {
  const { toast } = useToast();

  const handleExport = () => {
    try {
      if (transactions.length === 0) {
        toast({
          title: "Nenhuma transação para exportar",
          description: "Adicione transações antes de exportar.",
          variant: "destructive"
        });
        return;
      }
      
      exportTransactionsToCSV(transactions);
      
      toast({
        title: "Exportação concluída",
        description: "Suas transações foram exportadas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao exportar transações:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar suas transações.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 bg-white hover:bg-gray-100"
    >
      <Download className="w-4 h-4" />
      Exportar CSV
    </Button>
  );
});