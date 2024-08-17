// src/components/ForgotPassword.tsx
import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    try {
      await axios.post('/api/auth/forgot-password', { email });
      alert('Password reset link sent');
    } catch (error) {
      alert('Failed to send password reset link');
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleForgotPassword}>Send Reset Link</button>
    </div>
  );
};

export default ForgotPassword;
