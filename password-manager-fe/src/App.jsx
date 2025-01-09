import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const [passwords, setPasswords] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Added
    const [showAddModal, setShowAddModal] = useState(false); // Added
    const [activeCategory, setActiveCategory] = useState('all'); // Added

    useEffect(() => {
        const fetchPasswords = async () => {
            try {
                const response = await fetch('/api/passwords/retrieve');
                const data = await response.json();
                const firstUser = Object.keys(data)[0];
                setUser(firstUser);
                setPasswords(data[firstUser].data.map((item, index) => ({
                    ...item,
                    id: index + 1,
                    isFavorite: false,
                    isTrash: false
                })));
            } catch (error) {
                console.error('Error fetching passwords:', error);
            }
        };

        fetchPasswords();
    }, []);

    const handleLogin = (event) => {
        event.preventDefault();
        setIsLoggedIn(true);
    };

    const handleAdd = async (newPass) => {
        const newPasswordItem = {
            platform: newPass.site,
            username: newPass.username,
            password: newPass.password
        };

        try {
            const response = await fetch('/api/passwords/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: user,
                    newPassword: newPasswordItem
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add password');
            }

            const result = await response.json();

            if (result.success) {
                const updatedPasswords = [
                    ...passwords,
                    {
                        ...newPasswordItem,
                        id: passwords.length + 1,
                        isFavorite: false,
                        isTrash: false
                    }
                ];
                setPasswords(updatedPasswords);
                setShowAddModal(false);
            } else {
                console.error('Failed to add password:', result.message);
            }
        } catch (error) {
            console.error('Error adding password:', error);
        }
    };

    const handleDelete = (id) => {
        setPasswords(passwords.filter(pass => pass.id !== id));
    };

    const toggleFavorite = (id) => {
        setPasswords(passwords.map(pass =>
            pass.id === id ? { ...pass, isFavorite: !pass.isFavorite, isTrash: false } : pass
        ));
    };

    const toggleTrash = (id) => {
        setPasswords(passwords.map(pass =>
            pass.id === id ? { ...pass, isTrash: !pass.isTrash, isFavorite: false } : pass
        ));
    };

    const filteredPasswords = passwords.filter(pass => {
        if (activeCategory === 'favorites') return pass.isFavorite;
        if (activeCategory === 'trash') return pass.isTrash;
        return !pass.isTrash;
    });

    if (!isLoggedIn) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <>
            <Dashboard
                passwords={filteredPasswords}
                onAdd={() => setShowAddModal(true)}
                onToggleFavorite={toggleFavorite}
                onToggleTrash={toggleTrash}
                onDelete={handleDelete}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
            />
            {showAddModal && <AddPasswordModal onAdd={handleAdd} onClose={() => setShowAddModal(false)} />}
        </>
    );
}

function LoginPage({ onLogin }) {
    return (
        <div className="login-page">
            <div className="login-container">
                <h1>Password Manager</h1>
                <form onSubmit={onLogin}>
                    <input type="text" placeholder="Email address" required />
                    <input type="password" placeholder="Master password" required />
                    <button type="submit">Log In</button>
                </form>
            </div>
        </div>
    );
}

function Dashboard({ passwords, onAdd, onToggleFavorite, onToggleTrash, onDelete, activeCategory, setActiveCategory }) {
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
                            onDelete={onDelete}
                        />
                    ))}
                </section>
            </main>
        </div>
    );
}

function PasswordItem({ item, onToggleFavorite, onToggleTrash, onDelete }) {
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
            <div className="site-icon">{item.platform[0]}</div>
            <div className="item-details">
                <h3>{item.platform}</h3>
                <p>{item.username}</p>
                <div className="password-field">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={item.password}
                        readOnly
                    />
                    <button onClick={togglePasswordVisibility}>👁️</button>
                    <button onClick={copyPassword}>📋</button>
                </div>
            </div>
            <div className="item-actions">
                <button onClick={() => onToggleFavorite(item.id)}>⭐</button>
                <button onClick={() => onToggleTrash(item.id)}>🗑️</button>
                <button onClick={() => onDelete(item.id)}>❌</button>
            </div>
        </div>
    );
}

function AddPasswordModal({ onAdd, onClose }) {
    const [platform, setPlatform] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onAdd({ site: platform, username, password });
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Add New Password</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Website/Platform" value={platform} onChange={(e) => setPlatform(e.target.value)} required />
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit">Add</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
}

export default App;
