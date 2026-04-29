import {apiCore} from "@/common/api/core";
import type {ApiResponseInterface, TransactionType} from "src/types";

const api = new apiCore()

async function get<T>(params: Record<string, any> = {}, notification: boolean = false): Promise<T[]> {
    const baseUrl = '/institution/transaction'
    const result = await api.get<T[]>(baseUrl, params, notification)
        .then((value: ApiResponseInterface<T[]>) => value.result);
    return result !== undefined ? result : [];
}

async function store(params: Record<string, any> = {}, notification: boolean = false) {
    const baseUrl = '/institution/transaction'
    return await api.create<TransactionType>(baseUrl, params, notification).then((resp) => resp);
}

async function update(params: Record<string, any> = {}) {
    const baseUrl = `/institution/transaction/${params.id}`
    return await api.update<TransactionType>(baseUrl, params, false).then((resp) => resp);
}

async function destroy(id: number | undefined) {
    const baseUrl = `/institution/transaction/${id}`
    return await api.delete(baseUrl, true).then((resp) => resp);
}

async function dashboard <T>(params: Record<string, any> = {}) {
    const baseUrl = '/dashboard/transaction'
    const result = await api.get<T>(baseUrl, params, false)
        .then((value: ApiResponseInterface<T>) => value.result);
    return result !== undefined ? result : undefined;
}

export {get, store, update, destroy, dashboard}
