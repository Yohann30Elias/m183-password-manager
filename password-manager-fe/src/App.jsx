import React, { useState } from 'react';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwords, setPasswords] = useState([
    { site: 'Google', username: 'user@gmail.com', password: '********' },
    { site: 'Facebook', username: 'user@fb.com', password: '********' },
  ]);

  const handleLogin = (event) => {
    event.preventDefault();
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
        <div className="App">
          <header className="App-header">
            <h1>Login to Password Manager</h1>
            <form onSubmit={handleLogin}>
              <input type="text" placeholder="Username" required />
              <input type="password" placeholder="Password" required />
              <button type="submit">Login</button>
            </form>
          </header>
        </div>
    );
  }

  const handleAdd = () => {
    const newPass = { site: 'New Site', username: 'user@new.com', password: '********' };
    setPasswords([...passwords, newPass]);
  };

  return (
      <div className="App">
        <header className="App-header">
          <h1>Password Manager</h1>
          <PasswordList passwords={passwords} />
          <button onClick={handleAdd}>Add Password</button>
        </header>
      </div>
  );
}

function PasswordList({ passwords }) {
  return (
      <div className="password-list">
        {passwords.map((item, index) => (
            <div key={index} className="password-item">
              <h3>{item.site}</h3>
              <p>Username: {item.username}</p>
              <p>Password: {item.password}</p>
            </div>
        ))}
      </div>
  );
}

export default App;
