import { apiCore } from "@/common/api/core";
import type { ApiResponseInterface, StudentOriginType } from "@/types";

const api = new apiCore()

async function get(params: Record<string, any> = {}, notification: boolean = false): Promise<StudentOriginType[]> {
    const baseUrl = '/student/origin'
    const result = await api.get<StudentOriginType[]>(baseUrl, params, notification)
        .then((value: ApiResponseInterface<StudentOriginType[]>) => value.result);
    return result !== undefined ? result : [];
}

async function store(params: Record<string, any> = {}, notification: boolean = true) {
    const baseUrl = '/student/origin'
    const result = await api.create<StudentOriginType>(baseUrl, params, notification)
        .then((resp) => resp.result)
    return result !== undefined ? result : undefined;
}

async function update(params: Record<string, any> = {}, notification: boolean = true) {
    const baseUrl = `/student/origin/${params.id}`
    return await api.update<StudentOriginType>(baseUrl, params, notification)
        .then((resp) => resp.result);
}

async function destroy(id: number | undefined, notification: boolean = true) {
    const baseUrl = `/student/origin/${id}`
    return await api.delete(baseUrl, notification).then((resp) => resp);
}

export { get, store, update, destroy }
