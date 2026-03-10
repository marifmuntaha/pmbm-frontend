import {apiCore} from "@/common/api/core";
import type {ApiResponseInterface, BoardingType} from "@/types";

const api = new apiCore()

async function get<T>(params: Record<string, any> = {}, notification: boolean = false): Promise<T[]> {
    const baseUrl = '/master/boarding'
    const result = await api.get<T[]>(baseUrl, params, notification)
        .then((value: ApiResponseInterface<T[]> ) => value.result);
    return result !== undefined ? result : [];
}

async function store(params: Record<string, any> = {}) {
    const baseUrl = '/master/boarding'
    const result =  await api.create<BoardingType>(baseUrl, params, true)
        .then((resp) => resp.result)
    return result !== undefined ? result : [];
}

async function update(params: Record<string, any> = {}) {
    const baseUrl = `/master/boarding/${params.id}`
    return await api.update<BoardingType>(baseUrl, params, true).then((resp) => resp);
}

async function destroy(id: number|undefined) {
    const baseUrl = `/master/boarding/${id}`
    return await api.delete(baseUrl, true).then((resp) => resp);
}

export {get, store, update, destroy}
