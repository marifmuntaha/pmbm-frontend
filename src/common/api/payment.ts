import { apiCore } from "@/common/api/core";
import type { ApiResponseInterface, InvoiceType } from "@/types";

const api = new apiCore()

async function get<T>(params: Record<string, any> = {}, notification: boolean = false): Promise<T[]> {
    const baseUrl = '/payment'
    const result = await api.get<T[]>(baseUrl, params, notification)
        .then((value: ApiResponseInterface<T[]>) => value.result);
    return result !== undefined ? result : [];
}

async function store(params: Record<string, any> = {}) {
    const baseUrl = '/payment'
    return await api.create<any>(baseUrl, params, false).then((resp) => resp);
}

async function show(params: Record<string, any> = {}) {
    const baseUrl = `/invoice/${params.id}`
    return await api.get<InvoiceType>(baseUrl, params, true).then((resp) => resp.result);
}

async function update(params: Record<string, any> = {}, notification: boolean = true): Promise<void> {
    const baseUrl = `/invoice/${params.id}`
    return await api.update<InvoiceType>(baseUrl, params, notification).then((resp) => resp);
}

async function destroy(id: number | undefined) {
    const baseUrl = `/invoice/${id}`
    return await api.delete(baseUrl, true).then((resp) => resp);
}

async function cash(params: Record<string, any> = {}) {
    const baseUrl = '/payment/cash'
    return await api.create<any>(baseUrl, params, true).then((resp) => resp);
}

async function sendWhatsapp(id: number | undefined, notification: boolean = true) {
    const baseUrl = `/payment/${id}/send-whatsapp`
    return await api.create<any>(baseUrl, {}, notification).then((resp) => resp);
}

async function getActiveGateway() {
    const baseUrl = '/payment/active-gateway'
    return await api.get<any>(baseUrl, {}, false).then((resp) => resp.result);
}

export { get, store, show, update, destroy, cash, getActiveGateway, sendWhatsapp }
