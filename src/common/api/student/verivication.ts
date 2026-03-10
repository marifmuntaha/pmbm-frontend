import { apiCore } from "@/common/api/core";
import type { ApiResponseInterface, StudentVerificationType } from "@/types";

const api = new apiCore()

async function get(params: Record<string, any> = {}, notification: boolean = false): Promise<StudentVerificationType[]> {
    const baseUrl = '/student/verification'
    const result = await api.get<StudentVerificationType[]>(baseUrl, params, notification)
        .then((value: ApiResponseInterface<StudentVerificationType[]>) => value.result);
    return result !== undefined ? result : [];
}

async function store(params: Record<string, any> = {}, notification: boolean = true) {
    const baseUrl = '/student/verification'
    const result = await api.create<StudentVerificationType>(baseUrl, params, notification)
        .then((resp) => resp.result)
    return result !== undefined ? result : undefined;
}

async function update(params: Record<string, any> = {}, notification: boolean = true) {
    const baseUrl = `/student/verification/${params.id}`
    return await api.update<StudentVerificationType>(baseUrl, params, notification)
        .then((resp) => resp.result);
}

async function destroy(id: number | undefined) {
    const baseUrl = `/student/verification/${id}`
    return await api.delete(baseUrl, true).then((resp) => resp);
}

export { get, store, update, destroy }
