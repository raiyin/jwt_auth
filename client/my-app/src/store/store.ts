import { BlockLike } from "typescript";
import { IUser } from "../models/IUser";
import { makeAutoObservable } from "mobx";
import AuthService from "../services/AuthService";
// Дефолтный инстанс аксиос вместо того, что создали ранее,
// чтобы интерцептеры не делали лишнюю работу.
import axios from "axios";
import { AuthResponse } from "../models/response/AuthResponse";
import { API_URL } from "../http";

export default class Store {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;

    constructor() {
        // Чтобы mobx мог работать с этим классом.
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        }
        catch (e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async registration(email: string, password: string) {
        try {
            const response = await AuthService.registration(email, password);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        }
        catch (e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
        }
        catch (e: any) {
            console.log(e.response?.data?.message);
        }
    }

    // Для автоматического логина при открытии приложения, если до
    // этого пользователь уже регистрировался.
    async ckeckAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true });
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        }
        catch (e: any) {
            console.log(e.response?.data?.message);
        }
        finally {
            this.setLoading(false);
        }
    }
}
