import {apiCore} from "@/common/api/core";
import type {ApiResponseInterface, ProductType} from "@/types";

const api = new apiCore()

async function get<T>(params: Record<string, any> = {}, notification: boolean = false): Promise<T[]> {
    const baseUrl = '/master/product'
    const result = await api.get<T[]>(baseUrl, params, notification)
        .then((value: ApiResponseInterface<T[]> ) => value.result);
    return result !== undefined ? result : [];
}

async function store(params: Record<string, any> = {}) {
    const baseUrl = '/master/product'
    return await api.create<ProductType>(baseUrl, params, true).then((resp) => resp);
}

async function show(params: Record<string, any> = {}) {
    const baseUrl = `/master/product/${params.id}`
    return await api.get<ProductType>(baseUrl, params, true).then((resp) => resp.result);
}

async function update(params: Record<string, any> = {}) {
    const baseUrl = `/master/product/${params.id}`
    return await api.update<ProductType>(baseUrl, params, true).then((resp) => resp);
}

async function destroy(id: number|undefined) {
    const baseUrl = `/master/product/${id}`
    return await api.delete(baseUrl, true).then((resp) => resp);
}

export {get, store, show, update, destroy}
