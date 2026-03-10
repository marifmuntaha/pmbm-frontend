import {apiCore} from "@/common/api/core";
import type {ApiResponseInterface, InstitutionActivityType} from "@/types";

const api = new apiCore()

async function get(params: Record<string, any> = {}, notification: boolean = false): Promise<InstitutionActivityType[]> {
    const baseUrl = '/institution/activity'
    const result = await api.get<InstitutionActivityType[]>(baseUrl, params, notification)
        .then((value: ApiResponseInterface<InstitutionActivityType[]>) => value.result);
    return result !== undefined ? result : [];
}

async function store(params: Record<string, any> = {}) {
    const baseUrl = '/institution/activity'
    const result = await api.createWithFile<InstitutionActivityType>(baseUrl, params, true)
        .then((resp) => resp.result)
    return result !== undefined ? result : undefined;
}

async function update(params: Record<string, any> = {}) {
    const baseUrl = `/institution/activity/${params.id}`
    return await api.updateWithFile<InstitutionActivityType>(baseUrl, params, true)
        .then((resp) => resp.result);
}

async function destroy(id: number | undefined) {
    const baseUrl = `/institution/activity/${id}`
    return await api.delete(baseUrl, true).then((resp) => resp);
}

export {get, store, update, destroy}
