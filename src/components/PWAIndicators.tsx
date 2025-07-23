
import { PWAOfflineIndicator } from "@/components/PWAOfflineIndicator";
import { PWAUpdatePrompt } from "@/components/PWAUpdatePrompt";
import { PWAStatusIndicator } from "@/components/PWAStatusIndicator";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { memo } from "react";

interface PWAIndicatorsProps {
  pwaLifecycle: {
    isOnline: boolean;
    updateAvailable: boolean;
    isInstalled: boolean;
    installing: boolean;
    updateApp: () => void;
  };
}

export const PWAIndicators = memo(({ pwaLifecycle }: PWAIndicatorsProps) => {
  return (
    <>
      <PWAOfflineIndicator isOnline={pwaLifecycle.isOnline} />
      <PWAUpdatePrompt 
        updateAvailable={pwaLifecycle.updateAvailable} 
        onUpdate={pwaLifecycle.updateApp} 
      />
      <PWAStatusIndicator 
        isInstalled={pwaLifecycle.isInstalled} 
        installing={pwaLifecycle.installing} 
      />
      <PWAInstallPrompt />
    </>
  );
});
