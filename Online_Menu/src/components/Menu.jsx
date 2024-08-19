import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import MenuItem from './MenuItem';

function Menu() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'menus'), (snapshot) => {
      const categories = snapshot.docs.map(doc => ({
        id: doc.id,
        category: doc.id,
        items: doc.data().items || []
      }));

      const allItems = [];
      categories.forEach(category => {
        const itemsRef = collection(db, 'menus', category.id, 'items');
        onSnapshot(itemsRef, (itemSnapshot) => {
          const items = itemSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          allItems.push({ category: category.category, items });
          setMenuItems([...allItems]);
        });
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-center mb-10">Cardápio do Restaurante</h1>
      {menuItems.map(({ category, items }) => (
        <div key={category} className="mb-10">
          <h2 className="text-3xl font-bold mb-4 capitalize">{category.replace('-', ' ')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item, index) => (
              <MenuItem key={index} name={item.name} description={item.description} price={item.price} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Menu;
