import axios from "axios";
import { AuthResponse } from "../models/response/AuthResponse";

export const API_URL = `http://localhost:5000/api`;

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
});


$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
});

// Interceptor при 401.
$api.interceptors.response.use((config) => {
    return config;
}, (async error => {
    const originalRequest = error.config;

    // Чтобы не было зацикливания, если запрос обновления токенов тоже вернёт 401.
    if (error.response.status === 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true });
            localStorage.setItem('token', response.data.accessToken);
            return $api.request(originalRequest);
        } catch (e) {
            console.log('Not authorized');
        }
    }
    throw error;
}));

export default $api;
