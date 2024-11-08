import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import MenuItem from './MenuItem';
import logo from '../assets/Logo.png';

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

      // Exibir o spinner com logo por pelo menos 2 segundos
      setTimeout(() => setLoading(false), 2000);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6 max-w-screen-lg mx-auto bg-[#3b2415] text-[#f5f5f5] min-h-screen">
      {/* Spinner de Carregamento Inicial com Logo */}
      {loading ? (
        <div className="flex flex-col justify-center items-center min-h-screen">
          <img src={logo} alt="Logo do Restaurante" className="w-36 h-auto mb-6 animate-pulse" />
          <div className="w-16 h-16 border-4 border-t-transparent border-[#e1cbb1] rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Logo do Restaurante */}
          <div className="flex justify-center mb-10">
            <img src={logo} alt="Logo do Restaurante" className="w-36 h-auto" />
          </div>
          
          {/* Título Principal */}
          <h1 className="text-4xl font-bold text-center mb-10 text-[#e1cbb1]">Menu</h1>
          
          {/* Categorias e Itens */}
          {menuItems.length > 0 ? (
            menuItems.map(({ category, items }) => (
              <div key={category} className="mb-8">
                <details className="bg-[#693f26] rounded-lg shadow-md p-4 transition-all duration-500 ease-out">
                  <summary className="text-2xl font-bold cursor-pointer capitalize text-[#e1cbb1] hover:text-[#f5f5f5] transition-colors duration-300">
                    {category.replace('-', ' ')}
                  </summary>
                  <div className="mt-4 space-y-6">
                    {items.length > 0 ? (
                      items.map(item => (
                        <MenuItem
                          key={item.id}
                          name={item.name}
                          description={item.description}
                          price={item.price}
                          image={item.image}
                        />
                      ))
                    ) : (
                      <p className="text-gray-300">Nenhum prato disponível nesta categoria.</p>
                    )}
                  </div>
                </details>
              </div>
            ))
          ) : (
            <p className="text-gray-300 text-center">Nenhuma categoria disponível.</p>
          )}
        </>
      )}
    </div>
  );
}

export default Menu;
