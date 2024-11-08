import React, { useState } from 'react';

function MenuItem({ name, description, price, image }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="flex items-center space-x-4 bg-[#7b5836] rounded-lg p-4 shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-200 ease-in-out">
        {image && (
          <div className="relative">
            <img
              src={image}
              alt={name}
              className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:scale-110 transition-transform duration-200 ease-in-out"
              onClick={openModal} // Abre o modal ao clicar na imagem
            />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#3b2415]">{name}</h3>
          <p className="text-gray-200">{description}</p>
          <p className="font-semibold text-[#f5f5f5]">€{price}</p>
        </div>
      </div>

      {/* Modal para Exibir Imagem Ampliada */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50">
          <div className="relative">
            <img src={image} alt={name} className="max-w-full max-h-screen object-cover rounded-lg" />
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full"
            >
              X
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default MenuItem;
