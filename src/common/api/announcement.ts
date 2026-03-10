import { apiCore } from "./core";
import type { AnnouncementType } from "@/types";

const api = new apiCore();

export async function get(params: any = {}): Promise<AnnouncementType[]> {
    return await api.get<AnnouncementType[]>('announcement', params)
        .then((value) => value.result || []);
}

export async function create(payload: Partial<AnnouncementType>): Promise<AnnouncementType | null> {
    return await api.create<AnnouncementType>('announcement', payload, true)
        .then((value) => value.result || null);
}

export async function update(id: number, payload: Partial<AnnouncementType>): Promise<AnnouncementType | null> {
    return await api.update<AnnouncementType>(`announcement/${id}`, payload, true)
        .then((value) => value.result || null);
}

export async function destroy(id: number): Promise<boolean> {
    return await api.delete(`announcement/${id}`, true)
        .then((res) => res.status === 'success');
}
