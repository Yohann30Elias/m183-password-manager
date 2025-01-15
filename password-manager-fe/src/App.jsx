import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const [passwords, setPasswords] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        if (isLoggedIn && user) {
            const fetchPasswords = async () => {
                try {
                    const response = await fetch('/api/passwords/retrieve');
                    if (!response.ok) {
                        throw new Error('Failed to fetch passwords');
                    }
                    const data = await response.json();

                    const userPasswords = data[user]?.data || [];
                    setPasswords(userPasswords.map((item, index) => ({
                        ...item,
                        id: index + 1,
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

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${errorText}`);
            }

            const data = await response.json();

            if (data.success) {
                setIsLoggedIn(true);
                setUser(email);
            } else {
                setError(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
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
            password: newPass.password,
        };

        try {
            const response = await fetch('/api/passwords/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: user,
                    newPassword: newPasswordItem,
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
                    },
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

    const handleDeletePassword = async (platform) => {
        try {
            const response = await fetch(`/api/passwords/delete/platform/${platform}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user }),
            });

            if (response.ok) {
                setPasswords((prev) => prev.filter((password) => password.platform !== platform));
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete password');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const copyToClipboard = (password) => {
        navigator.clipboard.writeText(password);
    };

    if (!isLoggedIn) {
        return <LoginPage onLogin={handleLogin} error={error} />;
    }

    return (
        <>
            <Dashboard
                user={user}
                passwords={passwords}
                onAdd={() => setShowAddModal(true)}
                onLogout={handleLogout}
                onDelete={handleDeletePassword}
                onCopy={copyToClipboard}
            />
            {showAddModal && (
                <AddPasswordModal onAdd={handleAdd} onClose={() => setShowAddModal(false)} />
            )}
            {error && <div className="error">{error}</div>}
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
                {error && <div className="error">{error}</div>}
            </div>
        </div>
    );
}

function Dashboard({ user, passwords, onAdd, onLogout, onDelete, onCopy }) {
    return (
        <div className="dashboard">
            <header>
                <h1>Password Manager</h1>
                <div>
                    <span>Welcome, {user}</span>
                    <button onClick={onLogout}>Log Out</button>
                </div>
                <button onClick={onAdd}>Add Password</button>
            </header>
            <main>
                <section className="password-list">
                    {passwords.map((item) => (
                        <PasswordItem key={item.id} item={item} onDelete={onDelete} onCopy={onCopy} />
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
                    <input
                        type="text"
                        placeholder="Website/Platform"
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Add</button>
                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}

function PasswordItem({ item, onDelete, onCopy }) {
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    return (
        <div className="password-item">
            <div className="site-icon">{item.platform[0]}</div>
            <div className="item-details">
                <h3>{item.platform}</h3>
                <p>{item.username}</p>
                <div className="password-field">
                    <input
                        type={isPasswordVisible ? 'text' : 'password'}
                        value={item.password}
                        readOnly
                    />
                    <button onClick={() => setPasswordVisible(!isPasswordVisible)}>
                        {isPasswordVisible ? 'Hide' : 'Show'}
                    </button>
                    <button onClick={() => onCopy(item.password)}>Copy</button>
                    <button onClick={() => onDelete(item.platform)}>Delete</button>
                </div>
            </div>
        </div>
    );
}

export default App;
