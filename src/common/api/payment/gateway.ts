import { apiCore } from "@/common/api/core";
import type { ApiResponseInterface, GatewayType } from "@/types";

const api = new apiCore();

export async function get(params: Record<string, any> = {}, notification: boolean = false): Promise<GatewayType[]> {
    const baseUrl = '/payment/gateway'
    const result = await api.get<GatewayType[]>(baseUrl, params, notification)
        .then((value: ApiResponseInterface<GatewayType[]>) => value.result);
    return result !== undefined ? result : [];
}

export async function update(params: Record<string, any> = {}, notification: boolean = false) {
    const baseUrl = `/payment/gateway/${params.id}`
    return await api.update<GatewayType>(baseUrl, params, notification).then((resp) => resp);
}