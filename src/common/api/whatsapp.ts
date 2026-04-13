import { apiCore } from "@/common/api/core";
import type { ApiResponseInterface, WhatsappType } from "@/types";

const api = new apiCore()

async function get<T>(params: Record<string, any> = {}, notification: boolean = false): Promise<T[]> {
    const baseUrl = '/whatsapp'
    const result = await api.get<T[]>(baseUrl, params, notification)
        .then((value: ApiResponseInterface<T[]>) => value.result);
    return result !== undefined ? result : [];
}

async function store(params: Record<string, any> = {}, notification = true) {
    const baseUrl = '/whatsapp'
    return await api.create<WhatsappType>(baseUrl, params, notification)
        .then((resp) => resp)
}

async function show(id: number | undefined): Promise<WhatsappType | undefined> {
    const baseUrl = `/whatsapp/${id}`
    return await api.get<WhatsappType>(baseUrl, {}, false).then((resp: ApiResponseInterface<WhatsappType>) => resp.result);
}

async function update(params: Record<string, any> = {}, notification: boolean = true) {
    const baseUrl = `/whatsapp/${params.id}`
    return await api.update<WhatsappType>(baseUrl, params, notification).then((resp) => resp);
}

async function destroy(id: number | undefined, notification: boolean = true) {
    const baseUrl = `/whatsapp/${id}`
    return await api.delete(baseUrl, notification).then((resp) => resp);
}

async function login(params: Record<string, any> = {}, notification = false) {
    const baseUrl = `/whatsapp/login`
    return await api.create<any>(baseUrl, params, notification)
        .then((resp: ApiResponseInterface<any>) => resp.result);
}
export { get, store, show, update, destroy, login }
