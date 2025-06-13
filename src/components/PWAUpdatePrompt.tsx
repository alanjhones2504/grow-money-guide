
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PWAUpdatePromptProps {
  updateAvailable: boolean;
  onUpdate: () => void;
}

export const PWAUpdatePrompt = ({ updateAvailable, onUpdate }: PWAUpdatePromptProps) => {
  const { toast } = useToast();

  if (!updateAvailable) return null;

  const handleUpdate = () => {
    toast({
      title: "Atualizando App",
      description: "A página será recarregada com a nova versão...",
    });
    onUpdate();
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-2xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">
                Nova versão disponível!
              </h3>
              <p className="text-xs text-white/90 mb-2">
                Clique para atualizar e obter as últimas melhorias.
              </p>
              <Button
                onClick={handleUpdate}
                size="sm"
                className="bg-white text-blue-600 hover:bg-white/90 font-semibold"
              >
                <Download className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
