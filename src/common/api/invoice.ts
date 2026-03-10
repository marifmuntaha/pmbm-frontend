import { apiCore } from "@/common/api/core";
import type { ApiResponseInterface, InvoiceType } from "@/types";

const api = new apiCore()

async function get<T>(params: Record<string, any> = {}, notification: boolean = false): Promise<T[]> {
    const baseUrl = '/invoice'
    const result = await api.get<T[]>(baseUrl, params, notification)
        .then((value: ApiResponseInterface<T[]>) => value.result);
    return result !== undefined ? result : [];
}

async function store(params: Record<string, any> = {}) {
    const baseUrl = '/invoice'
    return await api.create<InvoiceType>(baseUrl, params, true).then((resp) => resp);
}

async function show<T>(params: Record<string, any> = {}) {
    const baseUrl = `/invoice/${params.id}`
    return await api.get<T>(baseUrl, params, true).then((resp) => resp.result);
}

async function update(params: Record<string, any> = {}, notification: boolean = true) {
    const baseUrl = `/invoice/${params.id}`
    return await api.update<InvoiceType>(baseUrl, params, notification).then((resp) => resp);
}

async function destroy(id: number | undefined) {
    const baseUrl = `/invoice/${id}`
    return await api.delete(baseUrl, true).then((resp) => resp);
}

async function sendWhatsapp(id: number | undefined) {
    const baseUrl = `/invoice/${id}/send-whatsapp`
    return await api.create(baseUrl, {}, true).then((resp) => resp);
}

export { get, store, show, update, destroy, sendWhatsapp }
