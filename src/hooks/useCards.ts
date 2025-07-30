import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/types/Card";
import { CardStorage } from "@/utils/storage";

export const useCards = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [cardForm, setCardForm] = useState({ nome: "", banco: "", limite: "", diaVencimento: "" });
  const [showCardForm, setShowCardForm] = useState(false);
  const { toast } = useToast();

  // Carregar cartões do localStorage ao iniciar
  useEffect(() => {
    try {
      const savedCards = CardStorage.load();
      setCards(savedCards);
    } catch (error) {
      console.error('Erro ao carregar cartões:', error);
      toast({
        title: "Erro ao carregar cartões",
        description: "Não foi possível carregar seus cartões salvos.",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Salvar cartões no localStorage sempre que cards mudar
  useEffect(() => {
    if (cards.length === 0) return; // Não salvar array vazio no primeiro carregamento
    
    const success = CardStorage.save(cards);
    if (!success) {
      toast({
        title: "Erro ao salvar cartões",
        description: "Não foi possível salvar seus cartões.",
        variant: "destructive"
      });
    }
  }, [cards, toast]);

  const handleCardInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCardForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleAddCard = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!cardForm.nome) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe o nome do cartão.",
        variant: "destructive"
      });
      return;
    }
    
    setCards(prev => [
      ...prev,
      { id: Date.now(), ...cardForm, diaVencimento: parseInt(cardForm.diaVencimento) || 1 }
    ]);
    
    setCardForm({ nome: "", banco: "", limite: "", diaVencimento: "" });
    setShowCardForm(false);
    
    toast({
      title: "Cartão adicionado",
      description: "Seu cartão foi cadastrado com sucesso."
    });
  }, [cardForm, toast]);

  const deleteCard = useCallback((id: number) => {
    setCards(prev => prev.filter(card => card.id !== id));
    toast({
      title: "Cartão removido",
      description: "O cartão foi removido com sucesso."
    });
  }, [toast]);

  return {
    cards,
    cardForm,
    showCardForm,
    setShowCardForm,
    handleCardInput,
    handleAddCard,
    deleteCard
  };
};