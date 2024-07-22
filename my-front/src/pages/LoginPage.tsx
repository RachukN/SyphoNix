import React from 'react';
import { useHistory } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { login } from '../services/api';

const LoginPage: React.FC = () => {
    const history = useHistory();

    const handleLogin = async (email: string, password: string) => {
        const success = await login(email, password);
        if (success) {
            history.push('/');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <AuthForm onSubmit={handleLogin} buttonText="Login">
                <div>
                    <a href="/register">Don't have an account? Register</a>
                </div>
                <div>
                    <a href="/forgot-password">Forgot Password?</a>
                </div>
            </AuthForm>
        </div>
    );
};

export default LoginPage;
