import {apiCore} from "@/common/api/core";
import type {ApiResponseInterface, InstitutionAccountType} from "@/types";

const api = new apiCore()

async function get<T>(params: Record<string, any> = {}, notification: boolean = false): Promise<T[]> {
    const baseUrl = '/institution/account'
    const result = await api.get<T[]>(baseUrl, params, notification)
        .then((value: ApiResponseInterface<T[]>) => value.result);
    return result !== undefined ? result : [];
}

async function store(params: Record<string, any> = {}) {
    const baseUrl = '/institution/account'
    return await api.create<InstitutionAccountType>(baseUrl, params, false).then((resp) => resp);
}

async function update(params: Record<string, any> = {}) {
    const baseUrl = `/institution/account/${params.id}`
    return await api.update<InstitutionAccountType>(baseUrl, params, false).then((resp) => resp);
}

async function destroy(id: number | undefined) {
    const baseUrl = `/institution/account/${id}`
    return await api.delete(baseUrl, true).then((resp) => resp);
}

export {get, store, update, destroy}
