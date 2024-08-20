import React from 'react';

function MenuItem({ name, description, price, image }) {
  return (
    <div className="mb-6 p-4 border rounded-lg flex items-start bg-white shadow-sm">
      {image && (
        <img
          src={image}
          alt={name}
          className="w-32 h-32 object-cover rounded-lg mr-4"
        />
      )}
      <div className="flex-1">
        <h3 className="text-2xl font-bold">{name}</h3>
        <p className="whitespace-pre-line text-gray-700">{description}</p>
        <p className="text-xl font-semibold mt-4 text-gray-900">€{price}</p>
      </div>
    </div>
  );
}

export default MenuItem;
