import React, { useState } from 'react';

function MenuItem({ name, description, price, image }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div
        className="flex items-center space-x-4 bg-[#7b5836] rounded-lg p-4 shadow-md hover:shadow-lg transition-transform duration-200 ease-in-out cursor-pointer"
        onClick={openModal} // Abre o modal ao clicar no card
      >
        {image && (
          <div className="relative">
            <img
              src={image}
              alt={name}
              className="w-24 h-24 object-cover rounded-lg"
            />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#3b2415]">{name}</h3>
          <p className="text-gray-200">{description}</p>
          <p className="font-semibold text-[#f5f5f5]">{price}€</p>
        </div>
      </div>

      {/* Modal para Exibir Imagem Ampliada */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50 transition-opacity duration-300 ease-in-out"
          onClick={closeModal} // Fecha o modal ao clicar em qualquer lugar do fundo
        >
          <div className="relative p-4 bg-white rounded-lg" onClick={(e) => e.stopPropagation()}> {/* Evita fechar ao clicar na imagem */}
            <img
              src={image}
              alt={name}
              className="w-[60vw] max-w-md max-h-[60vh] object-cover rounded-lg" // Controla o tamanho da imagem
            />
          </div>
        </div>
      )}
    </>
  );
}

export default MenuItem;
