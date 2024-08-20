import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import MenuItem from './MenuItem';

function Menu() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'menus'), (snapshot) => {
      const categories = snapshot.docs.map(doc => ({
        id: doc.id,
        category: doc.id,
        items: []
      }));

      categories.forEach((category) => {
        const itemsCollection = collection(db, 'menus', category.id, 'items');
        onSnapshot(itemsCollection, (itemSnapshot) => {
          const items = itemSnapshot.docs.map(itemDoc => ({
            id: itemDoc.id,
            ...itemDoc.data()
          }));
          setMenuItems(prevItems => 
            prevItems.map(cat => 
              cat.id === category.id ? { ...cat, items } : cat
            )
          );
        });
      });

      setMenuItems(categories);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6 max-w-screen-lg mx-auto">
      <h1 className="text-4xl font-bold text-center mb-10">Cardápio do Restaurante</h1>
      {menuItems.length > 0 ? (
        menuItems.map(({ category, items }) => (
          <div key={category} className="mb-5">
            <details className="bg-gray-200 rounded-lg shadow-md p-4">
              <summary className="text-2xl font-bold cursor-pointer capitalize">
                {category.replace('-', ' ')}
              </summary>
              <div className="mt-4">
                {items.length > 0 ? (
                  items.map(item => (
                    <MenuItem key={item.id} name={item.name} description={item.description} price={item.price} />
                  ))
                ) : (
                  <p className="text-gray-600">Nenhum prato disponível nesta categoria.</p>
                )}
              </div>
            </details>
          </div>
        ))
      ) : (
        <p className="text-gray-600 text-center">Nenhuma categoria disponível.</p>
      )}
    </div>
  );
}

export default Menu;
