const API_URL = 'http://localhost:5059/api';

export const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/account/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe: true }),
    });

    return response.ok;
};

export const register = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/account/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, confirmPassword: password }),
    });

    return response.ok;
};

export const forgotPassword = async (email: string) => {
    const response = await fetch(`${API_URL}/account/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });

    return response.ok;
};

export const fetchTracks = async () => {
    const response = await fetch(`${API_URL}/music/tracks`);
    const data = await response.json();
    return data;
};
