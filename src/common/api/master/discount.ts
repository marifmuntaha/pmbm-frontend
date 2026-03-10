import {apiCore} from "@/common/api/core";
import type {ApiResponseInterface, DiscountType} from "@/types";

const api = new apiCore()

async function get<T>(params: Record<string, any> = {}, notification: boolean = false): Promise<T[]> {
    const baseUrl = '/master/discount'
    const result = await api.get<T[]>(baseUrl, params, notification)
        .then((value: ApiResponseInterface<T[]> ) => value.result);
    return result !== undefined ? result : [];
}

async function store(params: Record<string, any> = {}) {
    const baseUrl = '/master/discount'
    return await api.create<DiscountType>(baseUrl, params, true).then((resp) => resp);
}

async function show(params: Record<string, any> = {}) {
    const baseUrl = `/master/discount/${params.id}`
    return await api.get<DiscountType>(baseUrl, params, true).then((resp) => resp.result);
}

async function update(params: Record<string, any> = {}) {
    const baseUrl = `/master/discount/${params.id}`
    return await api.update<DiscountType>(baseUrl, params, true).then((resp) => resp);
}

async function destroy(id: number|undefined) {
    const baseUrl = `/master/discount/${id}`
    return await api.delete(baseUrl, true).then((resp) => resp);
}

export {get, store, show, update, destroy}
