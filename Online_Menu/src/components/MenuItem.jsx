import React, { useState } from 'react';

function MenuItem({ name, description, price, image }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center space-x-4 bg-[#7b5836] rounded-lg p-4 shadow-md">
        {image && (
          <div className="relative">
            <img
              src={image}
              alt={name}
              className="w-24 h-24 object-cover rounded-lg cursor-pointer transition-transform hover:scale-105"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#3b2415]">{name}</h3>
          <p className="text-gray-200">{description}</p>
          <p className="font-semibold text-[#f5f5f5]">{price} €</p>
        </div>
      </div>

      {/* Modal para exibição da imagem em tamanho maior */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              className="absolute top-2 right-2 text-white bg-red-600 rounded-full p-2 hover:bg-red-700 transition-colors"
              onClick={() => setIsModalOpen(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={image}
              alt={name}
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default MenuItem;
