import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FaEdit, FaTrash } from 'react-icons/fa';

const categories = ['entradas', 'pratos-principais', 'sobremesas'];

function Admin() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '' });
  const [menuItems, setMenuItems] = useState([]);
  const [view, setView] = useState('list');
  const [editingItem, setEditingItem] = useState(null); // Estado para edição
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'menus'), (snapshot) => {
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        category: doc.id,
        items: []
      }));

      categoriesData.forEach((category) => {
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

      setMenuItems(categoriesData);
    });

    return () => unsubscribe();
  }, []);

  const handleAddItem = async () => {
    if (auth.currentUser) {
      if (newItem.name && newItem.description && newItem.price) {
        const categoryDoc = collection(db, 'menus', selectedCategory, 'items');
        if (editingItem) {
          // Se estiver editando, atualiza o item
          await updateDoc(doc(categoryDoc, editingItem.id), newItem);
          setEditingItem(null);
        } else {
          // Caso contrário, adiciona um novo item
          await addDoc(categoryDoc, newItem);
        }
        setNewItem({ name: '', description: '', price: '' });
        alert('Prato salvo com sucesso!');
        setView('list');
      } else {
        alert('Por favor, preencha todos os campos.');
      }
    } else {
      alert('Você precisa estar autenticado para adicionar ou editar um prato.');
      navigate('/login');
    }
  };

  const handleDeleteItem = async (categoryId, itemId) => {
    if (auth.currentUser) {
      if (window.confirm('Tem certeza que deseja excluir este prato?')) {
        const itemDoc = doc(db, 'menus', categoryId, 'items', itemId);
        await deleteDoc(itemDoc);
      }
    } else {
      alert('Você precisa estar autenticado para excluir um prato.');
      navigate('/login');
    }
  };

  const handleEditItem = (categoryId, item) => {
    setEditingItem({ ...item, categoryId });
    setNewItem({ name: item.name, description: item.description, price: item.price });
    setSelectedCategory(categoryId);
    setView('add');
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <button onClick={() => { setView('add'); setEditingItem(null); }} className="hover:bg-gray-700 p-2 rounded transition">Adicionar Novo Prato</button>
          <button onClick={() => setView('list')} className="hover:bg-gray-700 p-2 rounded transition">Lista de Produtos</button>
        </div>
        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 p-2 rounded transition">Logout</button>
      </nav>

      <div className="p-6">
        {view === 'add' && (
          <div>
            <h1 className="text-3xl font-bold mb-5">{editingItem ? 'Editar Prato' : 'Adicionar Novo Prato'}</h1>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full p-3 border rounded mb-4 bg-gray-800 text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category.replace('-', ' ')}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Nome"
              className="block w-full p-3 border rounded mb-4 bg-gray-800 text-white"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <textarea
              placeholder="Descrição"
              className="block w-full p-3 border rounded mb-4 bg-gray-800 text-white"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            />
            <input
              type="text"
              placeholder="Preço"
              className="block w-full p-3 border rounded mb-4 bg-gray-800 text-white"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            />
            <button onClick={handleAddItem} className="bg-green-600 hover:bg-green-700 text-white p-3 rounded transition w-full">
              {editingItem ? 'Salvar Alterações' : 'Adicionar Prato'}
            </button>
          </div>
        )}

        {view === 'list' && (
          <div>
            <h1 className="text-3xl font-bold mb-5">Lista de Produtos</h1>
            {menuItems.length > 0 ? (
              menuItems.map(({ category, items }) => (
                <div key={category} className="mb-5">
                  <h2 className="text-xl font-bold mb-2 capitalize">{category.replace('-', ' ')}</h2>
                  {items.length > 0 ? (
                    items.map(item => (
                      <div key={item.id} className="bg-gray-800 shadow-md rounded-lg p-4 mb-4 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold">{item.name}</h3>
                          <p>{item.description}</p>
                          <p>Preço: €{item.price}</p>
                        </div>
                        <div className="flex space-x-4">
                          <button onClick={() => handleEditItem(category, item)} className="text-blue-400 hover:text-blue-600 transition">
                            <FaEdit size={20} />
                          </button>
                          <button onClick={() => handleDeleteItem(category, item.id)} className="text-red-400 hover:text-red-600 transition">
                            <FaTrash size={20} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Nenhum prato disponível nesta categoria.</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">Nenhuma categoria disponível.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
