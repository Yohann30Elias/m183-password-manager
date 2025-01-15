import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const [passwords, setPasswords] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [activeCategory, setActiveCategory] = useState('all');

    useEffect(() => {
        if (isLoggedIn && user) {
            const fetchPasswords = async () => {
                try {
                    const response = await fetch('/api/passwords/retrieve');
                    if (!response.ok) {
                        throw new Error('Failed to fetch passwords');
                    }
                    const data = await response.json();

                    // Abruf der spezifischen Benutzerdaten basierend auf `user`
                    const userPasswords = data[user]?.data || [];
                    setPasswords(userPasswords.map((item, index) => ({
                        ...item,
                        id: index + 1,
                        isFavorite: false,
                        isTrash: false,
                    })));
                } catch (error) {
                    setError(error.message);
                }
            };

            fetchPasswords();
        }
    }, [isLoggedIn, user]);

    const handleLogin = async (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        const masterPassword = event.target.password.value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, masterPassword }),
            });

            // Überprüfen, ob der Status OK ist (200-299)
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${errorText}`);
            }

            // Versuch, die Antwort als JSON zu analysieren
            const data = await response.json();

            // Überprüfen, ob die Anmeldung erfolgreich war
            if (data.success) {
                setIsLoggedIn(true);
                setUser(email); // Speichert den aktuellen Benutzer
            } else {
                setError(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            // Fehler behandeln und in der UI anzeigen
            console.error('Error during login:', error);
            setError(error.message || 'An unexpected error occurred. Please try again.');
        }
    };


    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
        setPasswords([]);
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
                setError('Failed to add password: ' + result.message);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const filteredPasswords = passwords.filter(pass => {
        if (activeCategory === 'favorites') return pass.isFavorite;
        if (activeCategory === 'trash') return pass.isTrash;
        return !pass.isTrash;
    });

    if (!isLoggedIn) {
        return <LoginPage onLogin={handleLogin} error={error} />;
    }

    return (
        <>
            <Dashboard
                user={user}
                passwords={filteredPasswords}
                onAdd={() => setShowAddModal(true)}
                onLogout={handleLogout}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
            />
            {showAddModal && <AddPasswordModal onAdd={handleAdd} onClose={() => setShowAddModal(false)} />}
            {error && <div className="error">{error}</div>} {/* Fehleranzeige */}
        </>
    );
}

function LoginPage({ onLogin, error }) {
    return (
        <div className="login-page">
            <div className="login-container">
                <h1>Password Manager</h1>
                <form onSubmit={onLogin}>
                    <input type="text" name="email" placeholder="Email address" required />
                    <input type="password" name="password" placeholder="Master password" required />
                    <button type="submit">Log In</button>
                </form>
                {error && <div className="error">{error}</div>} {/* Fehleranzeige */}
            </div>
        </div>
    );
}

function Dashboard({ user, passwords, onAdd, onLogout, activeCategory, setActiveCategory }) {
    return (
        <div className="dashboard">
            <header>
                <h1>Password Manager</h1>
                <div>
                    <span>Welcome, {user}</span>
                    <button onClick={onLogout}>Log Out</button>
                </div>
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
                        />
                    ))}
                </section>
            </main>
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

function PasswordItem({ item }) {
    return (
        <div className="password-item">
            <div className="site-icon">{item.platform[0]}</div>
            <div className="item-details">
                <h3>{item.platform}</h3>
                <p>{item.username}</p>
                <div className="password-field">
                    <input
                        type="password"
                        value={item.password}
                        readOnly
                    />
                </div>
            </div>
        </div>
    );
}

export default App;