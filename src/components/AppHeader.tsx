
import { Wallet } from "lucide-react";

export const AppHeader = () => {
  return (
    <div className="text-center space-y-4 animate-fade-in">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
          <Wallet className="text-white w-8 h-8" />
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
          Finanças na Palma da Mão
        </h1>
      </div>
      <p className="text-slate-600 text-xl font-medium max-w-2xl mx-auto">
        Controle suas finanças de forma simples, elegante e eficiente
      </p>
    </div>
  );
};
