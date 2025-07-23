import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3 } from "lucide-react";
import { TransactionList } from "@/components/TransactionList";
import { FinancialChart } from "@/components/FinancialChart";
import { CategoryBreakdown } from "@/components/CategoryBreakdown";
import { ExportButton } from "@/components/ExportButton";
import { Transaction } from "@/types/Transaction";
import { memo } from "react";

interface MainContentProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  updateTransaction?: (id: string, updated: Partial<Transaction>) => void;
}

const AnalyticsSection = ({ transactions }: { transactions: Transaction[] }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <FinancialChart transactions={transactions} />
    <CategoryBreakdown transactions={transactions} />
  </div>
);

export const MainContent = memo(({ transactions, onDelete, updateTransaction }: MainContentProps) => {
  return (
    <div className="animate-fade-in">
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-white/80 backdrop-blur-sm shadow-lg border-0 p-1 rounded-2xl">
            <TabsTrigger value="overview" className="rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="transactions" className="rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              Transações
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-1" />
              Análises
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-8">
          <AnalyticsSection transactions={transactions} />
          <TransactionList 
            transactions={transactions.slice(0, 5)} 
            onDelete={onDelete}
            showAll={false}
            updateTransaction={updateTransaction}
          />
        </TabsContent>

        <TabsContent value="transactions">
          <div className="flex justify-end mb-4">
            <ExportButton transactions={transactions} />
          </div>
          <TransactionList 
            transactions={transactions} 
            onDelete={onDelete}
            showAll={true}
            updateTransaction={updateTransaction}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-8">
          <AnalyticsSection transactions={transactions} />
        </TabsContent>
      </Tabs>
    </div>
  );
});
