import { apiCore } from "@/common/api/core";
import type { YearType, LandingDataType, RulesDataType, ScheduleData } from "@/types";

const api = new apiCore()

async function year(params: Record<string, any> = {}, notification: boolean = false): Promise<YearType | undefined> {
    const baseUrl = 'public/year'
    return await api.get<YearType>(baseUrl, params, notification)
        .then((resp) => {
            return resp.result
        });
}

async function landing(params: Record<string, any> = {}): Promise<LandingDataType | undefined> {
    const baseUrl = 'public/landing'
    return await api.get<LandingDataType>(baseUrl, params)
        .then((resp) => {
            return resp.result
        })
        .catch((_e) => {
            return undefined;
        });
}

async function rules(params: Record<string, any> = {}): Promise<RulesDataType | undefined> {
    const baseUrl = 'public/rules'
    return await api.get<RulesDataType>(baseUrl, params)
        .then((resp) => {
            return resp.result
        })
        .catch((_e) => {
            return undefined;
        });
}

async function schedule(params: Record<string, any> = {}): Promise<ScheduleData | undefined> {
    const baseUrl = 'public/schedule'
    return await api.get<ScheduleData>(baseUrl, params)
        .then((resp) => {
            return resp.result
        })
        .catch((_e) => {
            return undefined;
        });
}

export { year, landing, rules, schedule }