import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore';

const categories = ['entradas', 'pratos-principais', 'sobremesas'];

function Admin() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'menus'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        category: doc.id,
        items: doc.data().items || []
      }));
      setMenuItems(items);
    });

    return () => unsubscribe();
  }, []);

  const addItem = async () => {
    const categoryDoc = doc(db, 'menus', selectedCategory);
    await addDoc(collection(categoryDoc, 'items'), newItem);
    setNewItem({ name: '', description: '', price: '' });
  };

  const deleteItem = async (categoryId, itemId) => {
    const itemDoc = doc(db, 'menus', categoryId, 'items', itemId);
    await deleteDoc(itemDoc);
  };

  const updateItem = async (categoryId, itemId, updatedItem) => {
    const itemDoc = doc(db, 'menus', categoryId, 'items', itemId);
    await updateDoc(itemDoc, updatedItem);
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-5">Admin Dashboard</h1>
      <button onClick={handleLogout} className="mb-5 bg-red-500 text-white p-2 rounded">Logout</button>

      <div className="mb-5">
        <h2 className="text-2xl mb-2">Adicionar Novo Prato</h2>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="block w-full p-2 border rounded mb-2"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category.replace('-', ' ')}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Nome"
          className="block w-full p-2 border rounded mb-2"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Descrição"
          className="block w-full p-2 border rounded mb-2"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Preço"
          className="block w-full p-2 border rounded mb-2"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
        <button onClick={addItem} className="bg-green-500 text-white p-2 rounded">Adicionar Prato</button>
      </div>

      {menuItems.map(({ category, items }) => (
        <div key={category} className="mb-5">
          <h2 className="text-2xl font-bold mb-2 capitalize">{category.replace('-', ' ')}</h2>
          {items && items.map(item => (
            <div key={item.id} className="mb-4 p-4 border rounded">
              <h3 className="text-xl font-bold">{item.name}</h3>
              <p>{item.description}</p>
              <p>Preço: €{item.price}</p>
              <button
                onClick={() => deleteItem(category, item.id)}
                className="bg-red-500 text-white p-2 rounded mt-2"
              >
                Eliminar
              </button>
              <button
                onClick={() => updateItem(category, item.id, { ...item, price: prompt('Novo preço:', item.price) })}
                className="bg-blue-500 text-white p-2 rounded mt-2 ml-2"
              >
                Editar Preço
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Admin;
