import { Card } from "@/types/Card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface CardFormProps {
  cards: Card[];
  cardForm: {
    nome: string;
    banco: string;
    limite: string;
    fechamento: string;
  };
  showCardForm: boolean;
  setShowCardForm: (show: boolean) => void;
  handleCardInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddCard: (e: React.FormEvent) => void;
  deleteCard: (id: number) => void;
}

export const CardForm = ({
  cards,
  cardForm,
  showCardForm,
  setShowCardForm,
  handleCardInput,
  handleAddCard,
  deleteCard
}: CardFormProps) => {
  return (
    <div className="mt-12 max-w-md mx-auto bg-white rounded shadow p-6">
      {!showCardForm ? (
        <button
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition font-semibold"
          onClick={() => setShowCardForm(true)}
        >
          Cadastrar Cartão
        </button>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">Cadastrar Novo Cartão</h2>
          <form onSubmit={handleAddCard} className="space-y-4">
            <input
              type="text"
              name="nome"
              placeholder="Nome da pessoa"
              value={cardForm.nome}
              onChange={handleCardInput}
              className="w-full border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              name="banco"
              placeholder="Banco"
              value={cardForm.banco}
              onChange={handleCardInput}
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="number"
              name="limite"
              placeholder="Limite"
              value={cardForm.limite}
              onChange={handleCardInput}
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="date"
              name="fechamento"
              placeholder="Data de fechamento"
              value={cardForm.fechamento}
              onChange={handleCardInput}
              className="w-full border rounded px-3 py-2"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
              >
                Salvar Cartão
              </button>
              <button
                type="button"
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
                onClick={() => setShowCardForm(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
          
          {/* Lista de cartões cadastrados */}
          {cards.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Cartões cadastrados:</h3>
              <ul className="space-y-2">
                {cards.map(card => (
                  <li key={card.id} className="border rounded px-3 py-2 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{card.nome} - {card.banco}</div>
                      <div className="text-sm text-gray-600">
                        {card.limite && `Limite: R$ ${card.limite}`}
                        {card.fechamento && ` • Fechamento: ${card.fechamento}`}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deleteCard(card.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};