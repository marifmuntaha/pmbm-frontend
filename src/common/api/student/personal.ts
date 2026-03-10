import { apiCore } from "@/common/api/core";
import type { ApiResponseInterface, StudentPersonalType } from "@/types";

const api = new apiCore()

async function get(params: Record<string, any> = {}, notification: boolean = false): Promise<StudentPersonalType[]> {
    const baseUrl = '/student/personal'
    const result = await api.get<StudentPersonalType[]>(baseUrl, params, notification)
        .then((value: ApiResponseInterface<StudentPersonalType[]>) => value.result);
    return result !== undefined ? result : [];
}

async function store(params: Record<string, any> = {}, notification: boolean = true) {
    const baseUrl = '/student/personal'
    const result = await api.create<StudentPersonalType>(baseUrl, params, notification)
        .then((resp) => resp.result)
    return result !== undefined ? result : undefined;
}

async function update(params: Record<string, any> = {}, notification: boolean = true) {
    const baseUrl = `/student/personal/${params.id}`
    return await api.update<StudentPersonalType>(baseUrl, params, notification)
        .then((resp) => resp.result);
}

async function destroy(id: number | undefined, notification: boolean = true) {
    const baseUrl = `/student/personal/${id}`
    return await api.delete(baseUrl, notification).then((resp) => resp);
}

export { get, store, update, destroy }
