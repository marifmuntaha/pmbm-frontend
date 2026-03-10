import { apiCore } from "@/common/api/core";
import type { ApiResponseInterface, StudentProgramType } from "@/types";

const api = new apiCore()

async function get(params: Record<string, any> = {}, notification: boolean = false): Promise<StudentProgramType[]> {
    const baseUrl = '/student/program'
    const result = await api.get<StudentProgramType[]>(baseUrl, params, notification)
        .then((value: ApiResponseInterface<StudentProgramType[]>) => value.result);
    return result !== undefined ? result : [];
}

async function store(params: Record<string, any> = {}, notification: boolean = true) {
    const baseUrl = '/student/program'
    const result = await api.create<StudentProgramType>(baseUrl, params, notification)
        .then((resp) => resp.result)
    return result !== undefined ? result : undefined;
}

async function update(params: Record<string, any> = {}, notification: boolean = true) {
    const baseUrl = `/student/program/${params.id}`
    return await api.update<StudentProgramType>(baseUrl, params, notification)
        .then((resp) => resp.result);
}

async function destroy(id: number | undefined, notification: boolean = true) {
    const baseUrl = `/student/program/${id}`
    return await api.delete(baseUrl, notification).then((resp) => resp);
}

export { get, store, update, destroy }
