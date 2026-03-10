import { apiCore } from "@/common/api/core";
import type { ApiResponseInterface, RuleType } from "@/types";

const api = new apiCore()
const baseUrl = '/master/rule'

async function get(params: Record<string, any> = {}): Promise<RuleType[]> {
    const result = await api.get<RuleType[]>(baseUrl, params)
        .then((value: ApiResponseInterface<RuleType[]>) => value.result);
    return result !== undefined ? result : [];
}

async function store(params: Record<string, any> = {}) {
    const result = await api.create<RuleType>(baseUrl, params, true)
        .then((resp) => resp.result)
    return result !== undefined ? result : undefined;
}

async function update(params: Record<string, any> = {}) {
    const url = `${baseUrl}/${params.id}`
    return await api.update<RuleType>(url, params, true)
        .then((resp) => resp.result);
}

async function destroy(id: number | undefined) {
    const url = `${baseUrl}/${id}`
    return await api.delete(url, true).then((resp) => resp);
}

export { get, store, update, destroy }
