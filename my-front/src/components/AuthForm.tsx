import React, { useState } from 'react';

interface AuthFormProps {
    onSubmit: (email: string, password: string) => void;
    buttonText: string;
    children?: React.ReactNode;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, buttonText, children }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(email, password);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit">{buttonText}</button>
            {children}
        </form>
    );
};

export default AuthForm;
