import React from 'react';

function MenuItem({ name, description, price, image }) {
  return (
    <div className="mb-4 p-4 border rounded flex items-start">
      {image && (
        <img
          src={image}
          alt={name}
          className="w-20 h-20 object-cover rounded-lg mr-4"
        />
      )}
      <div>
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="whitespace-pre-line">{description}</p>
        <p className="text-lg font-semibold mt-2">€{price}</p>
      </div>
    </div>
  );
}

export default MenuItem;
