// src/components/Register.tsx
import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';
import './qwer.png';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');


  const handleRegister = async (fullName: string, email: string, password: string) => {
    try {
      const response = await axios.post(`http://localhost:5059/api/Auth/register`, {
        fullName,
        email,
        password
      });
      console.log('Registration successful', response.data);
    } catch (error) {
      console.error('Registration failed', error.response?.data);
    }
  };

  return (



    <div className="register-container">


      <h2>Створити аккаунт</h2>
      <input
        type="text"
        placeholder="Ім'я"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => handleRegister(fullName, email, password)}>Створити</button>
      <div class="grid-container">
        <div><div className="aw" >Вже маєте аккаунт? </div>
        </div>
        <div class="grid-container" href="/login" ><a className="az" > Увійти</a>

          <div><svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 18 16" fill="none">
            <path d="M1.5 7.99999H16.5M16.5 7.99999L10.25 1.65384M16.5 7.99999L10.25 14.3461" stroke="#00FF03" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          </svg></div>
        </div>
      </div>
    </div>

  );
};

export default Register;
