import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const [passwords, setPasswords] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState(null);

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

    const copyToClipboard = (password) => {
        navigator.clipboard.writeText(password);
    };

    if (!isLoggedIn) {
        return <LoginPage onLogin={handleLogin} error={error} />;
    }

    return (
        <div className="dashboard">
            <header>
                <h1>Password Manager</h1>
                <div>
                    <span>Welcome, {user}</span>
                    <button onClick={handleLogout}>Log Out</button>
                </div>
            </header>
            <main>
                <section className="password-list">
                    {passwords.map((item) => (
                        <PasswordItem
                            key={item.id}
                            item={item}
                            onCopy={copyToClipboard}
                        />
                    ))}
                </section>
            </main>
        </div>
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

function PasswordItem({ item, onCopy }) {
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
                    <button
                        className="eye-button"
                        onClick={() => setPasswordVisible(!isPasswordVisible)}
                    >
                        {isPasswordVisible ? 'Hide' : 'Show'}
                    </button>
                    <button
                        className="copy-button"
                        onClick={() => onCopy(item.password)}
                    >
                        Copy
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
