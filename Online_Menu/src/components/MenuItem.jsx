import React from 'react';

function MenuItem({ name, description, price }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-5">
      <h2 className="text-2xl font-bold mb-2">{name}</h2>
      <p className="text-gray-700 mb-4">{description}</p>
      <p className="text-lg font-semibold">€{price}</p>
    </div>
  );
}

export default MenuItem;
