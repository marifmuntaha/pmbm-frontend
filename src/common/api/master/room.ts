import { apiCore } from "@/common/api/core";
import type { ApiResponseInterface, RoomType } from "@/types";

const api = new apiCore();

async function get(params: Record<string, any> = {}, notification: boolean = false): Promise<RoomType[]> {
    const baseUrl = '/master/room';
    const result = await api.get<RoomType[]>(baseUrl, params, notification)
        .then((value: ApiResponseInterface<RoomType[]>) => value.result);
    return result !== undefined ? result : [];
}

async function store(params: Record<string, any> = {}) {
    const baseUrl = '/master/room';
    const result = await api.create<RoomType>(baseUrl, params, true)
        .then((resp) => resp.result);
    return result !== undefined ? result : [];
}

async function update(params: Record<string, any> = {}) {
    const baseUrl = `/master/room/${params.id}`;
    return await api.update<RoomType>(baseUrl, params, true).then((resp) => resp);
}

async function destroy(id: number | undefined) {
    const baseUrl = `/master/room/${id}`;
    return await api.delete(baseUrl, true).then((resp) => resp);
}

export { get, store, update, destroy };
