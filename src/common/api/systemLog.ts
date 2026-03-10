import { apiCore } from "@/common/api/core";
import type { ApiResponseInterface } from "@/types";

const api = new apiCore();

export interface SystemLogItem {
    id: number;
    userId: number | null;
    level: string;
    message: string;
    context: any;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
    };
}

export interface PaginatedLogs {
    data: SystemLogItem[];
    total: number;
    last_page: number;
    current_page: number;
}

async function getLogs(params: Record<string, any> = {}): Promise<PaginatedLogs | null> {
    const baseUrl = '/system/logs';
    const result = await api.get<PaginatedLogs>(baseUrl, params, false)
        .then((value: ApiResponseInterface<PaginatedLogs>) => value.result);
    return result !== undefined ? result : null;
}

async function deleteLog(id: number | string): Promise<boolean> {
    const baseUrl = `/system/logs/${id}`;
    const result = await api.delete(baseUrl, true)
        .then((resp: ApiResponseInterface<any>) => resp.status === 'success');
    return result;
}

async function clearLogs(): Promise<boolean> {
    const baseUrl = '/system/logs/clear';
    const result = await api.delete(baseUrl, true)
        .then((resp: ApiResponseInterface<any>) => resp.status === 'success');
    return result;
}

export { getLogs, deleteLog, clearLogs };
