import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FaEdit, FaTrash, FaTimes, FaSun, FaMoon } from 'react-icons/fa';
import { getStorage, ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';

const categories = ['entradas', 'pratos-principais', 'sobremesas'];

function Admin() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', image: null });
  const [menuItems, setMenuItems] = useState([]);
  const [view, setView] = useState('list');
  const [editingItem, setEditingItem] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const storage = getStorage();

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

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error("Erro ao fazer logout:", error);
      });
  };

  const handleDeleteImage = async (itemId, imageUrl) => {
    if (window.confirm('Tem certeza que deseja excluir esta imagem?')) {
      try {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);

        const categoryDoc = doc(db, 'menus', selectedCategory, 'items', itemId);
        await updateDoc(categoryDoc, { image: null });

        alert('Imagem excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir a imagem:', error);
        alert('Falha ao excluir a imagem.');
      }
    }
  };

  const handleAddItem = async () => {
    if (auth.currentUser) {
      if (newItem.name && newItem.description && newItem.price) {
        let imageUrl = null;
        
        if (newItem.image) {
          try {
            const imageRef = ref(storage, `menu-images/${newItem.image.name}`);
            await uploadBytes(imageRef, newItem.image);
            imageUrl = await getDownloadURL(imageRef);
          } catch (error) {
            console.error('Erro ao carregar a imagem:', error);
            alert('Falha ao carregar a imagem. Verifique a conexão ou tente novamente.');
            return;
          }
        }

        const itemData = {
          name: newItem.name,
          description: newItem.description,
          price: newItem.price,
          image: imageUrl,
        };

        const categoryDoc = collection(db, 'menus', selectedCategory, 'items');
        if (editingItem) {
          await updateDoc(doc(categoryDoc, editingItem.id), itemData);
          setEditingItem(null);
        } else {
          await addDoc(categoryDoc, itemData);
        }
        setNewItem({ name: '', description: '', price: '', image: null });
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

  const handleDeleteItem = async (categoryId, itemId, imageUrl) => {
    if (auth.currentUser) {
      if (window.confirm('Tem certeza que deseja excluir este prato?')) {
        const itemDoc = doc(db, 'menus', categoryId, 'items', itemId);
        if (imageUrl) {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
        }
        await deleteDoc(itemDoc);
      }
    } else {
      alert('Você precisa estar autenticado para excluir um prato.');
      navigate('/login');
    }
  };

  const handleEditItem = (categoryId, item) => {
    setEditingItem({ ...item, categoryId });
    setNewItem({ name: item.name, description: item.description, price: item.price, image: null });
    setSelectedCategory(categoryId);
    setView('add');
  };

  const handleCancel = () => {
    setEditingItem(null);
    setNewItem({ name: '', description: '', price: '', image: null });
    setView('list');
  };

  const handleFileChange = (e) => {
    setNewItem({ ...newItem, image: e.target.files[0] });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <nav className={`${darkMode ? 'bg-gray-800' : 'bg-gray-300'} text-white p-4 flex justify-between items-center`}>
        <div className="flex space-x-4">
          <button onClick={() => { setView('add'); setEditingItem(null); }} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-400'} p-2 rounded transition`}>Adicionar Novo Prato</button>
          <button onClick={() => setView('list')} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-400'} p-2 rounded transition`}>Lista de Produtos</button>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={toggleDarkMode} className={`${darkMode ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-500 hover:bg-gray-600'} p-2 rounded-full transition`}>
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 p-2 rounded transition">Logout</button>
        </div>
      </nav>

      <div className="p-6">
        {view === 'add' && (
          <div>
            <h1 className="text-3xl font-bold mb-5">{editingItem ? 'Editar Prato' : 'Adicionar Novo Prato'}</h1>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`block w-full p-3 border rounded mb-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'} focus:outline-none focus:border-gray-500 appearance-none`}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category.replace('-', ' ')}</option>
                ))}
              </select>
            </div>
            <input
              type="text"
              placeholder="Nome"
              className={`block w-full p-3 border rounded mb-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'} focus:outline-none focus:border-gray-500`}
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <textarea
              placeholder="Descrição"
              className={`block w-full p-3 border rounded mb-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'} focus:outline-none focus:border-gray-500`}
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            />
            <input
              type="text"
              placeholder="Preço"
              className={`block w-full p-3 border rounded mb-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'} focus:outline-none focus:border-gray-500`}
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            />
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-gray-400 mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={handleAddItem} className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition text-sm">
                {editingItem ? 'Salvar' : 'Adicionar'}
              </button>
              <button onClick={handleCancel} className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition text-sm">
                Cancelar
              </button>
            </div>
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
                      <div key={item.id} className={`flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 bg-gray-200 shadow-md rounded-lg p-4 mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        <div className="w-full md:w-32">
                          {item.image && (
                            <div className="relative">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <button
                                onClick={() => handleDeleteImage(item.id, item.image)}
                                className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition"
                              >
                                <FaTimes size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold">{item.name}</h3>
                          <p>{item.description}</p>
                          <p>Preço: {item.price}€</p>
                        </div>
                        <div className="flex space-x-4">
                          <button onClick={() => handleEditItem(category, item)} className="text-blue-400 hover:text-blue-600 transition">
                            <FaEdit size={20} />
                          </button>
                          <button onClick={() => handleDeleteItem(category, item.id, item.image)} className="text-red-400 hover:text-red-600 transition">
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
