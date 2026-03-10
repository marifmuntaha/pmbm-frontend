import { apiCore } from "@/common/api/core";
import type { ApiResponseInterface, UserType } from "@/types";

const api = new apiCore()

async function get<T>(params: Record<string, any> = {}, notification: boolean = false): Promise<T[]> {
    const baseUrl = '/user'
    const result = await api.get<T[]>(baseUrl, params, notification)
        .then((value: ApiResponseInterface<T[]>) => value.result);
    return result !== undefined ? result : [];
}

async function store(params: Record<string, any> = {}, notification = true) {
    const baseUrl = '/user'
    return await api.create<UserType>(baseUrl, params, notification)
        .then((resp) => resp.result)
}

async function show(id: number | undefined): Promise<UserType | undefined> {
    const baseUrl = `/user/${id}`
    return await api.get<UserType>(baseUrl, {}, false).then((resp: ApiResponseInterface<UserType>) => resp.result);
}

async function update(params: Record<string, any> = {}, notification: boolean = true) {
    const baseUrl = `/user/${params.id}`
    return await api.update<UserType>(baseUrl, params, notification).then((resp) => resp);
}

async function destroy(id: number | undefined, notification: boolean = true) {
    const baseUrl = `/user/${id}`
    return await api.delete(baseUrl, notification).then((resp) => resp);
}

export { get, store, show, update, destroy }
