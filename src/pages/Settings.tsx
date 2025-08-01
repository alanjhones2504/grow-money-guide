import { memo } from "react";
import { CardForm } from "@/components/CardForm";
import { DataManager } from "@/components/DataManager";
import { Card } from "@/types/Card";

interface SettingsProps {
  cards: Card[];
  cardForm: {
    nome: string;
    banco: string;
    limite: string;
    diaVencimento: string;
    diaFechamento: string;
  };
  showCardForm: boolean;
  setShowCardForm: (show: boolean) => void;
  handleCardInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddCard: (e: React.FormEvent) => void;
  deleteCard: (id: number) => void;
  editingCardId: number | null;
  startEditCard: (card: Card) => void;
  updateCard: (e: React.FormEvent) => void;
  cancelEdit: () => void;
  onDataChange: () => void;
}

export const Settings = memo(({
  cards,
  cardForm,
  showCardForm,
  setShowCardForm,
  handleCardInput,
  handleAddCard,
  deleteCard,
  editingCardId,
  startEditCard,
  updateCard,
  cancelEdit,
  onDataChange
}: SettingsProps) => {
  return (
    <div className="space-y-8 pb-20 md:pb-6">
      {/* Header - Only on mobile */}
      <div className="md:hidden text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Configurações
        </h1>
        <p className="text-slate-600 mt-2">Gerencie cartões e dados</p>
      </div>

      {/* Desktop Layout */}
      <div className="md:grid md:grid-cols-3 md:gap-6 space-y-8 md:space-y-0">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-8">
          {/* Cadastro de Cartão */}
          <CardForm
            cards={cards}
            cardForm={cardForm}
            showCardForm={showCardForm}
            setShowCardForm={setShowCardForm}
            handleCardInput={handleCardInput}
            handleAddCard={handleAddCard}
            deleteCard={deleteCard}
            editingCardId={editingCardId}
            startEditCard={startEditCard}
            updateCard={updateCard}
            cancelEdit={cancelEdit}
          />

          {/* Gerenciador de Dados Locais */}
          <DataManager onDataChange={onDataChange} />
        </div>

        {/* Right Column */}
        <div className="md:col-span-1">
          {/* Informações do App */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Sobre o App</h3>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Versão:</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Desenvolvido por:</span>
                <span className="font-medium">Alan Jhones</span>
              </div>
              <div className="flex justify-between">
                <span>Última atualização:</span>
                <span className="font-medium">31/07/2025</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
              <h4 className="font-semibold text-indigo-800 mb-2">💡 Dicas de Uso</h4>
              <ul className="text-sm text-indigo-700 space-y-1">
                <li>• Clique nos cards coloridos para adicionar transações rapidamente</li>
                <li>• Marque cartões como pagos para controlar suas metas diárias</li>
                <li>• Use o backup para não perder seus dados</li>
                <li>• Cadastre os dias de fechamento e vencimento dos cartões</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});