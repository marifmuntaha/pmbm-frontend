import {apiCore} from "@/common/api/core";
import type {ApiResponseInterface, YearType} from "@/types";

const api = new apiCore()

async function get(params: Record<string, any> = {}, notification: boolean = false): Promise<YearType[]> {
    const baseUrl = '/master/year'
    const result = await api.get<YearType[]>(baseUrl, params, notification)
        .then((value: ApiResponseInterface<YearType[]> ) => value.result);
    return result !== undefined ? result : [];
}

async function store(params: Record<string, any> = {}) {
    const baseUrl = '/master/year'
    const result =  await api.create<YearType>(baseUrl, params, true)
        .then((resp) => resp.result)
    return result !== undefined ? result : [];
}

async function update(params: Record<string, any> = {}) {
    const baseUrl = `/master/year/${params.id}`
    return await api.update<YearType>(baseUrl, params, true).then((resp) => resp);
}

async function destroy(id: number|undefined) {
    const baseUrl = `/master/year/${id}`
    return await api.delete(baseUrl, true).then((resp) => resp);
}

export {get, store, update, destroy}
