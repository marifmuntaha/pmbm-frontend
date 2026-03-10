import { apiCore } from "@/common/api/core";
import type { ApiResponseInterface, StudentFileType } from "@/types";

const api = new apiCore()

async function get(params: Record<string, any> = {}, notification: boolean = false): Promise<StudentFileType[]> {
    const baseUrl = '/student/file'
    const result = await api.get<StudentFileType[]>(baseUrl, params, notification)
        .then((value: ApiResponseInterface<StudentFileType[]>) => value.result);
    return result !== undefined ? result : [];
}

async function store(params: Record<string, any> = {}, notification: boolean = true) {
    const baseUrl = '/student/file'
    const result = await api.createWithFile<StudentFileType>(baseUrl, params, notification)
        .then((resp) => resp.result)
    return result !== undefined ? result : undefined;
}

async function update(params: Record<string, any> = {}, notification: boolean = true) {
    const baseUrl = `/student/file/${params.id}`
    return await api.updateWithFile<StudentFileType>(baseUrl, params, notification)
        .then((resp) => resp.result);
}

async function destroy(id: number | undefined, notification: boolean = true) {
    const baseUrl = `/student/file/${id}`
    return await api.delete(baseUrl, notification).then((resp) => resp);
}

export { get, store, update, destroy }
