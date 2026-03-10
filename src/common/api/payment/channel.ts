import {apiCore} from "@/common/api/core";
import type {ApiResponseInterface} from "@/types";
import type {PaymentChannelType} from "@/types/model/payment";

const api = new apiCore()

async function get(params: Record<string, any> = {}, notification: boolean = false): Promise<PaymentChannelType[]> {
    const baseUrl = '/payment/channel'
    const result = await api.get<PaymentChannelType[]>(baseUrl, params, notification)
        .then((value: ApiResponseInterface<PaymentChannelType[]> ) => value.result);
    return result !== undefined ? result : [];
}

export {get}