import axios, {type AxiosResponse, AxiosError } from 'axios';
import type {ApiResponseInterface, AuthenticationType} from "@/types";
import {RToast} from "@/components";
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

class apiCore {

    constructor() {
        const token = this.getLoggedInUser();
        if (token) {
            this.setAuthorization(token);
        }
    }

    async get<T>(url: string, params: Record<string, string>, notification: boolean = false): Promise<ApiResponseInterface<T>> {
        if (Object.keys(params).length > 0) {
            url += '?' + Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
        }
        const response: AxiosResponse | AxiosError = await axios.get(`${url}`)
            .catch((error) => error);
        return this.handleResponse(response, notification);
    };

    getFile = async (url: string, params?: Record<string, string>): Promise<AxiosResponse> => {
        const queryString = params ? new URLSearchParams(params).toString() : '';
        const response = await axios.get(`${url}?${queryString}`, {
            responseType: 'blob',
            headers: {
                ...axios.defaults.headers.common,
            },
        }).catch(async (error: AxiosError) => {
            // Blob responses can contain JSON error messages — parse and re-throw
            if (error.response && error.response.data instanceof Blob) {
                const text = await error.response.data.text();
                try {
                    const json = JSON.parse(text);
                    throw new Error(json.statusMessage || json.message || 'Terjadi kesalahan');
                } catch (parseErr) {
                    if (parseErr instanceof SyntaxError) throw new Error(text);
                    throw parseErr;
                }
            }
            throw error;
        });
        return response as AxiosResponse;
    };

    getMultiple = (urls: string[], params?: Record<string, string>): Promise<AxiosResponse[]> => {
        const reqs: Promise<AxiosResponse>[] = [];
        let queryString = '';
        if (params) {
            queryString = params ? new URLSearchParams(params).toString() : '';
        }

        for (const url of urls) {
            reqs.push(axios.get(`${url}?${queryString}`));
        }
        return axios.all(reqs);
    };

    async create<T>(url: string, data: Record<string, any>, notify: boolean): Promise<ApiResponseInterface<T>> {
        const response: AxiosResponse | AxiosError = await axios.post(url, data)
            .catch((error: AxiosError) => error);
        return this.handleResponse<T>(response, notify);
    };

    updatePatch = (url: string, data: any): Promise<AxiosResponse> => {
        return axios.patch(url, data);
    };

    async update<T>(url: string, data: any, notify: boolean): Promise<ApiResponseInterface<T>> {
        const response: AxiosResponse | AxiosError = await axios.put(url, data)
            .catch((error: AxiosError) => error);
        return this.handleResponse<T>(response, notify);
    };

    delete = async (url: string, message: boolean): Promise<any> => {
        const response = await axios.delete(url).catch((error: AxiosError) => error);
        return this.handleResponse(response, message);
    };

    async createWithFile<T> (url: string, data: any, notify: boolean): Promise<ApiResponseInterface<T>> {
        const formData = new FormData();
        for (const k in data) {
            if (Array.isArray(data[k])) {
                for (const key in data[k]) {
                    const value = data[k][key] === undefined ? "" : data[k][key];
                    formData.append(`${k}[]`, value);
                }
            } else {
                const value = data[k] === undefined ? "" : data[k];
                formData.append(k, value);
            }
        }
        const config = {
            headers: {
                ...axios.defaults.headers.common,
                'content-type': 'multipart/form-data',
            },
        };
        const result = await axios.post(url, formData, config)
            .catch((error: AxiosError) => error);
        return this.handleResponse<T>(result, notify);
    };

    async updateWithFile<T>(url: string, data: any, notify: boolean): Promise<ApiResponseInterface<T>>{
        const formData = new FormData();
        for (const k in data) {
            if (Array.isArray(data[k])) {
                for (const key in data[k]) {
                    const value = data[k][key] === undefined ? "" : data[k][key];
                    formData.append(`${k}[]`, value);
                }
            } else {
                const value = data[k] === undefined ? "" : data[k];
                formData.append(k, value);
            }
        }
        formData.append('_method', 'put');
        const config = {
            headers: {
                ...axios.defaults.headers.common,
                'content-type': 'multipart/form-data',
            },
        };
        const result = await axios.post(url, formData, config)
            .catch((error: AxiosError) => error);
        return this.handleResponse<T>(result, notify);
    };

    isUserAuthenticated = (): boolean => {
        return this.getLoggedInUser() !== undefined;
    };

    setLoggedInUser = (session: AuthenticationType | undefined) => {
        if (session?.token !== undefined) {
            localStorage.setItem('__PMB_TOKEN_SERVICE__', session.token);
        } else {
            localStorage.removeItem('__PMB_TOKEN_SERVICE__');
        }
    };

    getLoggedInUser = (): AuthenticationType | undefined => {
        const token = localStorage.getItem('__PMB_TOKEN_SERVICE__');
        return token ? {token: token} : undefined;
    };

    setUserInSession = (modifiedUser: AuthenticationType) => {
        const userInfo = localStorage.getItem('__PMB_TOKEN_SERVICE__');
        if (userInfo) {
            this.setLoggedInUser(modifiedUser);
        }
    };

    setAuthorization = (auth: AuthenticationType | null): void => {
        if (auth?.token) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + auth.token;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    handleResponse<T>(resp: AxiosResponse | AxiosError, notification: boolean): ApiResponseInterface<T> {
        const { code, data} = resp as AxiosResponse & AxiosError;
        if (data) {
            const { status, statusMessage, result } = data;
            if (status === 'success') {
                if (statusMessage !== '' && notification) RToast(statusMessage, 'success');
                return {status: 'success', statusMessage: statusMessage, result: result as T};
            } else {
                if (statusMessage !== '' && notification) RToast(statusMessage);
                return {status: 'error', statusMessage: statusMessage, result: result as T};
            }
        } else {
            if (code === "ERR_NETWORK") {
                if(notification) RToast('Aplikasi tidak terhubung ke server.');
                return {status: 'error', statusMessage: 'Aplikasi tidak terhubung ke server.', result: null as T};
            } else {
                const {response}: any = resp as AxiosResponse & AxiosError;
                if (response) {
                    switch (response.status) {
                        case 401:
                            if(notification) RToast(response.data?.statusMessage ? response.data.statusMessage : "Sesi anda telah berakhir: Silakan masuk lagi.");
                            return {status: 'error', statusMessage: "Sesi anda telah berakhir: Silakan masuk lagi.", result: null as T};
                        case 403:
                            if(notification) RToast("Anda tidak memiliki izin untuk mengakses sumber daya ini.");
                            return {status: 'error', statusMessage: "Anda tidak memiliki izin untuk mengakses sumber daya ini.", result: null as T};
                        case 422:
                            if(notification) RToast(response.data.statusMessage);
                            return {status: 'error', statusMessage : response.data.statusMessage, result: null as T };
                        case 500:
                            if(notification) RToast("Server error, silahkan ulangi lagi.");
                            return {status: 'error', statusMessage: "Server error, silahkan ulangi lagi.", result: null as T};
                        default:
                            if(notification) RToast("Server error, silahkan ulangi lagi.");
                            return {status: 'error', statusMessage: response.data.message || 'Kesalahan tidak diketahui', result: null as T};
                    }
                } else {
                    if(notification) RToast("Kesalahan Jaringan: Tidak ada respons dari server");
                    return {status: 'error', statusMessage: 'Kesalahan Jaringan: Tidak ada respon dari server', result: null as T};
                }
            }
        }
    };
}

export { apiCore };
