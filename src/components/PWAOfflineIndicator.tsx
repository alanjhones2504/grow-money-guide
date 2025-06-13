
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WifiOff, Wifi } from 'lucide-react';

interface PWAOfflineIndicatorProps {
  isOnline: boolean;
}

export const PWAOfflineIndicator = ({ isOnline }: PWAOfflineIndicatorProps) => {
  if (isOnline) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <Card className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 shadow-2xl">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <WifiOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">
                Modo Offline
              </h3>
              <p className="text-xs text-white/90">
                Suas transações serão sincronizadas quando voltar online
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
