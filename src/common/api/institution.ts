import { apiCore } from "@/common/api/core";
import type { ApiResponseInterface, InstitutionType } from "@/types";

const api = new apiCore()

async function get<T>(params: Record<string, any> = {}, notification: boolean = false): Promise<T[]> {
    const baseUrl = '/institution'
    const result = await api.get<T[]>(baseUrl, params, notification)
        .then((value: ApiResponseInterface<T[]>) => value.result);
    return result !== undefined ? result : [];
}

async function store(params: Record<string, any> = {}) {
    const baseUrl = '/institution'
    return await api.createWithFile<InstitutionType>(baseUrl, params, true).then((resp) => resp);
}

async function show(params: Record<string, any> = {}) {
    const baseUrl = `/institution/${params.id}`
    return await api.get<InstitutionType>(baseUrl, params, true).then((resp) => resp.result);
}

async function update(params: Record<string, any> = {}) {
    const baseUrl = `/institution/${params.id}`
    return await api.updateWithFile<InstitutionType>(baseUrl, params, true).then((resp) => resp);
}

async function destroy(id: number | undefined) {
    const baseUrl = `/institution/${id}`
    return await api.delete(baseUrl, true).then((resp) => resp);
}

export { get, store, show, update, destroy }
