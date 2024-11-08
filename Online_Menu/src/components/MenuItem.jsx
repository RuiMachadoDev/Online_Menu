import React from 'react';

function MenuItem({ name, description, price, image }) {
  return (
    <div className="flex items-center space-x-4 bg-[#7b5836] rounded-lg p-4 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-out">
      {image && (
        <div className="relative">
          <img src={image} alt={name} className="w-24 h-24 object-cover rounded-lg transition-transform duration-500 ease-in-out hover:scale-105" />
        </div>
      )}
      <div className="flex-1">
        <h3 className="text-xl font-bold text-[#3b2415]">{name}</h3>
        <p className="text-gray-200">{description}</p>
        <p className="font-semibold text-[#f5f5f5]">€{price}</p>
      </div>
    </div>
  );
}

export default MenuItem;
