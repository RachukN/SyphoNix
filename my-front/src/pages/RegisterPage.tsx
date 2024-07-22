import React from 'react';
import { useHistory } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { register } from '../services/api';

const RegisterPage: React.FC = () => {
    const history = useHistory();

    const handleRegister = async (email: string, password: string) => {
        const success = await register(email, password);
        if (success) {
            history.push('/');
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <AuthForm onSubmit={handleRegister} buttonText="Register">
                <div>
                    <a href="/login">Already have an account? Login</a>
                </div>
            </AuthForm>
        </div>
    );
};

export default RegisterPage;
