import { apiCore } from "@/common/api/core";
import type { ApiResponseInterface, InstitutionProgramType } from "@/types";

const api = new apiCore()

async function get<T>(params: Record<string, any> = {}, notification: boolean = false): Promise<T[]> {
    const baseUrl = '/institution/program'
    const result = await api.get<T[]>(baseUrl, params, notification)
        .then((value: ApiResponseInterface<T[]>) => value.result);
    return result !== undefined ? result : [];
}

async function store(params: Record<string, any> = {}) {
    const baseUrl = '/institution/program'
    const result = await api.create<InstitutionProgramType>(baseUrl, params, true)
        .then((resp) => resp.result)
    return result !== undefined ? result : undefined;
}

async function update(params: Record<string, any> = {}) {
    const baseUrl = `/institution/program/${params.id}`
    return await api.update<InstitutionProgramType>(baseUrl, params, true)
        .then((resp) => resp.result);
}

async function destroy(id: number | undefined) {
    const baseUrl = `/institution/program/${id}`
    return await api.delete(baseUrl, true).then((resp) => resp);
}

export { get, store, update, destroy }
