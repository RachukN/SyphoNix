// src/components/Login.tsx
import React, { useState } from 'react';
import axios from 'axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    try {
      await axios.post('/api/auth/login', { email, password, rememberMe });
      alert('Login successful');
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div>
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <label>Remember Me</label>
      </div>
      <button onClick={handleLogin}>Login</button>
      <a href="/forgot-password">Forgot Password?</a>
    </div>
  );
};

export default Login;
