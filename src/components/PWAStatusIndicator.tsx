
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Globe } from 'lucide-react';

interface PWAStatusIndicatorProps {
  isInstalled: boolean;
  installing: boolean;
}

export const PWAStatusIndicator = ({ isInstalled, installing }: PWAStatusIndicatorProps) => {
  if (installing) {
    return (
      <div className="fixed top-4 right-4 z-40">
        <Badge className="bg-blue-500 text-white animate-pulse">
          <Smartphone className="w-3 h-3 mr-1" />
          Instalando...
        </Badge>
      </div>
    );
  }

  if (isInstalled) {
    return (
      <div className="fixed top-4 right-4 z-40">
        <Badge className="bg-green-500 text-white">
          <Smartphone className="w-3 h-3 mr-1" />
          App Instalado
        </Badge>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-40">
      <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
        <Globe className="w-3 h-3 mr-1" />
        Web App
      </Badge>
    </div>
  );
};
