import React from "react";

const CardList: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Meus Cartões</h1>
      {/* Aqui ficará a lista de cartões e os formulários de cadastro/edição */}
      <div className="bg-white rounded shadow p-4">
        <p>Nenhum cartão cadastrado ainda.</p>
        {/* Botão para adicionar novo cartão e funcionalidades futuras */}
      </div>
    </div>
  );
};

export default CardList; 