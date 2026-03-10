import { apiCore } from "@/common/api/core";
import type { ApiResponseInterface, StudentAchievementType } from "@/types";

const api = new apiCore()

async function get(params: Record<string, any> = {}, notification: boolean = false): Promise<StudentAchievementType[]> {
    const baseUrl = '/student/achievement'
    const result = await api.get<StudentAchievementType[]>(baseUrl, params, notification)
        .then((value: ApiResponseInterface<StudentAchievementType[]>) => value.result);
    return result !== undefined ? result : [];
}

async function store(params: Record<string, any> = {}, notification: boolean = true) {
    const baseUrl = '/student/achievement'
    const result = await api.createWithFile<StudentAchievementType>(baseUrl, params, notification)
        .then((resp) => resp.result)
    return result !== undefined ? result : undefined;
}

async function update(params: Record<string, any> = {}, notification: boolean = true) {
    const baseUrl = `/student/achievement/${params.id}`
    return await api.updateWithFile<StudentAchievementType>(baseUrl, params, notification)
        .then((resp) => resp.result);
}

async function destroy(id: number | undefined) {
    const baseUrl = `/student/achievement/${id}`
    return await api.delete(baseUrl, true).then((resp) => resp);
}

export { get, store, update, destroy }
