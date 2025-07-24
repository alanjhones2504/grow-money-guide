import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Upload, 
  Trash2, 
  HardDrive, 
  Shield, 
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { LocalStorage } from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";
import { memo } from "react";

interface DataManagerProps {
  onDataChange?: () => void;
}

export const DataManager = memo(({ onDataChange }: DataManagerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Obter informações de armazenamento
  const storageInfo = LocalStorage.getStorageSize();
  const usedMB = (storageInfo.used / (1024 * 1024)).toFixed(2);
  const totalMB = (storageInfo.total / (1024 * 1024)).toFixed(0);
  const usagePercent = ((storageInfo.used / storageInfo.total) * 100).toFixed(1);

  // Exportar dados
  const handleExport = () => {
    try {
      LocalStorage.exportToFile();
      toast({
        title: "Backup criado!",
        description: "Seus dados foram exportados com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro no backup",
        description: "Não foi possível criar o backup.",
        variant: "destructive"
      });
    }
  };

  // Importar dados
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const success = await LocalStorage.importFromFile(file);
      
      if (success) {
        toast({
          title: "Dados restaurados!",
          description: "Backup importado com sucesso.",
        });
        onDataChange?.();
      } else {
        toast({
          title: "Erro na importação",
          description: "Arquivo de backup inválido.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: "Não foi possível importar o backup.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      // Limpar input
      event.target.value = '';
    }
  };

  // Limpar todos os dados
  const handleClearData = () => {
    const confirmed = window.confirm(
      "⚠️ ATENÇÃO: Esta ação irá apagar TODOS os seus dados permanentemente!\n\n" +
      "Isso inclui:\n" +
      "• Todas as transações\n" +
      "• Todos os cartões cadastrados\n" +
      "• Todas as configurações\n\n" +
      "Tem certeza que deseja continuar?"
    );

    if (confirmed) {
      const success = LocalStorage.clearAllData();
      
      if (success) {
        toast({
          title: "Dados apagados",
          description: "Todos os dados foram removidos.",
        });
        onDataChange?.();
      } else {
        toast({
          title: "Erro ao apagar",
          description: "Não foi possível apagar os dados.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <HardDrive className="w-5 h-5 text-white" />
          </div>
          Gerenciar Dados Locais
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Status do Armazenamento */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Armazenamento Usado</span>
            <Badge variant="outline" className="font-mono">
              {usedMB} MB / {totalMB} MB
            </Badge>
          </div>
          
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                parseFloat(usagePercent) > 80 
                  ? 'bg-gradient-to-r from-red-500 to-red-600' 
                  : parseFloat(usagePercent) > 60
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500'
              }`}
              style={{ width: `${Math.min(parseFloat(usagePercent), 100)}%` }}
            />
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Shield className="w-3 h-3" />
            <span>Dados armazenados localmente no seu dispositivo</span>
          </div>
        </div>

        {/* Ações */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Exportar Backup */}
          <Button
            onClick={handleExport}
            variant="outline"
            className="flex items-center gap-2 h-auto p-4 flex-col bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300"
          >
            <Download className="w-5 h-5 text-blue-600" />
            <div className="text-center">
              <div className="font-semibold text-blue-700">Fazer Backup</div>
              <div className="text-xs text-blue-600">Exportar dados</div>
            </div>
          </Button>

          {/* Importar Backup */}
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={isLoading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <Button
              variant="outline"
              disabled={isLoading}
              className="w-full flex items-center gap-2 h-auto p-4 flex-col bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-300 disabled:opacity-50"
            >
              <Upload className="w-5 h-5 text-green-600" />
              <div className="text-center">
                <div className="font-semibold text-green-700">
                  {isLoading ? 'Importando...' : 'Restaurar Backup'}
                </div>
                <div className="text-xs text-green-600">Importar dados</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Limpar Dados */}
        <div className="pt-4 border-t border-slate-200">
          <Button
            onClick={handleClearData}
            variant="outline"
            className="w-full flex items-center gap-2 h-auto p-4 bg-gradient-to-br from-red-50 to-rose-50 border-red-200 hover:border-red-300 text-red-700 hover:text-red-800"
          >
            <AlertTriangle className="w-5 h-5" />
            <div className="text-center">
              <div className="font-semibold">Apagar Todos os Dados</div>
              <div className="text-xs opacity-75">⚠️ Ação irreversível</div>
            </div>
          </Button>
        </div>

        {/* Informações de Privacidade */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Privacidade Garantida
          </div>
          <ul className="text-xs text-slate-600 space-y-1 ml-6">
            <li>• Dados armazenados apenas no seu dispositivo</li>
            <li>• Nenhuma informação enviada para servidores</li>
            <li>• Funciona 100% offline</li>
            <li>• Você tem controle total dos seus dados</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
});