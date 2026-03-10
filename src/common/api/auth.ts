import type { ApiResponseInterface, AuthenticationType, VerifyPhoneType } from "@/types";
import { apiCore } from "@/common/api/core";
import type { UserType } from "@/types";
import { RToast } from "@/components";

const api = new apiCore();

async function register(params: Record<string, any>): Promise<AuthenticationType | undefined> {
    const baseUrl = '/auth/register';
    return await api.create(baseUrl, params, true)
        .then((resp: ApiResponseInterface<any>) => {
            if (resp.status === 'success') {
                api.setLoggedInUser(resp.result);
                return { user: resp.result?.user, token: resp.result?.token } as AuthenticationType
            } else {
                return undefined
            }
        })
}

async function login(params: Record<string, any>): Promise<AuthenticationType | undefined> {
    const baseUrl = '/auth/login';
    return await api.create<AuthenticationType>(baseUrl, params, true)
        .then((resp: ApiResponseInterface<AuthenticationType>) => {
            if (resp.status === 'success') {
                api.setLoggedInUser(resp.result);
                return { user: resp.result?.user, token: resp.result?.token } as AuthenticationType
            } else {
                return undefined
            }
        })
}

async function storeVerifyPhone(params: Record<string, any>): Promise<AuthenticationType | undefined> {
    const baseUrl = '/auth/phone-verify';
    return await api.create<AuthenticationType>(baseUrl, params, true)
        .then((resp: ApiResponseInterface<AuthenticationType>) => {
            if (resp.status === 'success') {
                api.setLoggedInUser(resp.result);
                return resp.result
            } else {
                return undefined
            }
        })
}

async function getVerifyPhone(params: Record<string, any>): Promise<VerifyPhoneType | undefined> {
    const baseUrl = '/auth/get-phone-verify';
    return await api.create<VerifyPhoneType>(baseUrl, params, true)
        .then((resp) => {
            if (resp.status === 'success') {
                return resp.result
            } else {
                return
            }
        })
}

async function profile(): Promise<UserType | undefined> {
    const baseUrl = '/auth/profile';
    return await api.get<UserType>(baseUrl, {}, false)
        .then((resp) => {
            if (resp.result) {
                return resp.result;
            }
            else {
                RToast(resp.statusMessage)
                setTimeout(() => {
                    api.setLoggedInUser(undefined)
                }, 2000)
            }
        })
}

async function logout(): Promise<void> {
    const api = new apiCore();
    const baseUrl = '/auth/logout';
    return await api.create(baseUrl, {}, false).then((resp => {
        if (resp.status === 'success') {
            api.setLoggedInUser(undefined);
        }
    }))
}
export { register, login, storeVerifyPhone, getVerifyPhone, profile, logout }
