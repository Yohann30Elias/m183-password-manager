import React, { useState } from 'react';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwords, setPasswords] = useState([
    { id: 1, site: 'Google', username: 'user@gmail.com', password: 'google123', isFavorite: false, isTrash: false },
    { id: 2, site: 'Facebook', username: 'user@fb.com', password: 'facebook456', isFavorite: false, isTrash: false },
  ]);
  const [activeCategory, setActiveCategory] = useState('all');

  const handleLogin = (event) => {
    event.preventDefault();
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const handleAdd = () => {
    const newPass = {
      id: passwords.length + 1,
      site: 'New Site',
      username: 'user@new.com',
      password: 'newpass789',
      isFavorite: false,
      isTrash: false
    };
    setPasswords([...passwords, newPass]);
  };

  const toggleFavorite = (id) => {
    setPasswords(passwords.map(pass =>
        pass.id === id ? { ...pass, isFavorite: !pass.isFavorite } : pass
    ));
  };

  const toggleTrash = (id) => {
    setPasswords(passwords.map(pass =>
        pass.id === id ? { ...pass, isTrash: !pass.isTrash } : pass
    ));
  };

  const filteredPasswords = passwords.filter(pass => {
    if (activeCategory === 'favorites') return pass.isFavorite && !pass.isTrash;
    if (activeCategory === 'trash') return pass.isTrash;
    return !pass.isTrash;
  });

  return (
      <Dashboard
          passwords={filteredPasswords}
          onAdd={handleAdd}
          onToggleFavorite={toggleFavorite}
          onToggleTrash={toggleTrash}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
      />
  );
}

function LoginPage({ onLogin }) {
  // ... (LoginPage component remains unchanged)
}

function Dashboard({ passwords, onAdd, onToggleFavorite, onToggleTrash, activeCategory, setActiveCategory }) {
  return (
      <div className="dashboard">
        <header>
          <h1>Password Manager</h1>
          <button onClick={onAdd}>Add Item</button>
        </header>
        <main>
          <aside>
            <nav>
              <ul>
                <li><a href="#" className={activeCategory === 'all' ? 'active' : ''} onClick={() => setActiveCategory('all')}>All Items</a></li>
                <li><a href="#" className={activeCategory === 'favorites' ? 'active' : ''} onClick={() => setActiveCategory('favorites')}>Favorites</a></li>
                <li><a href="#" className={activeCategory === 'trash' ? 'active' : ''} onClick={() => setActiveCategory('trash')}>Trash</a></li>
              </ul>
            </nav>
          </aside>
          <section className="password-list">
            {passwords.map((item) => (
                <PasswordItem
                    key={item.id}
                    item={item}
                    onToggleFavorite={onToggleFavorite}
                    onToggleTrash={onToggleTrash}
                />
            ))}
          </section>
        </main>
      </div>
  );
}

function PasswordItem({ item, onToggleFavorite, onToggleTrash }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(item.password)
        .then(() => alert('Password copied to clipboard!'))
        .catch(err => console.error('Failed to copy password: ', err));
  };

  return (
      <div className="password-item">
        <div className="site-icon">{item.site[0]}</div>
        <div className="item-details">
          <h3>{item.site}</h3>
          <p>{item.username}</p>
          <div className="password-field">
            <input
                type={showPassword ? "text" : "password"}
                value={item.password}
                readOnly
            />
            <button onClick={togglePasswordVisibility} className="eye-button">
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
            <button onClick={copyPassword} className="copy-button">
              📋
            </button>
            <button onClick={() => onToggleFavorite(item.id)} className="favorite-button">
              {item.isFavorite ? "⭐" : "☆"}
            </button>
            <button onClick={() => onToggleTrash(item.id)} className="trash-button">
              🗑️
            </button>
          </div>
        </div>
      </div>
  );
}

export default App;