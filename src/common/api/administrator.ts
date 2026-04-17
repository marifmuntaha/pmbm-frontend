import { apiCore } from "@/common/api/core";
import type { ApiResponseInterface } from "@/types";

const api = new apiCore();

export type AdminDashboardStats = {
    totalInstitutions: number;
    totalStudents: number;
    totalStudentsOut: number;
    totalVerified: number;
    totalUnverified: number;
    totalBoarding: number;
    totalNonBoarding: number;
    boardingBreakdown: Array<{
        name: string;
        count: number;
    }>;
    institutions: Array<{
        id: number;
        name: string;
        totalStudents: number;
        verified: number;
        unverified: number;
        out: number;
        totalPaid: number;
        totalUnpaid: number;
        totalInvoiced: number;
    }>;
    recentActivity: Array<{
        id: number;
        name: string;
        institutionName: string;
        program: string;
        created_at: string;
        verified: boolean;
    }>;
    recentPayments: Array<{
        id: number;
        amount: number;
        date: string;
        studentName: string;
        institutionName: string;
    }>;
}

async function getDashboardStats(params: Record<string, any> = {}): Promise<AdminDashboardStats | null> {
    const baseUrl = '/report/admin/stats';
    const result = await api.get<AdminDashboardStats>(baseUrl, params, false)
        .then((value: ApiResponseInterface<AdminDashboardStats>) => value.result);
    return result !== undefined ? result : null;
}

async function updateSystem(): Promise<{ log: string } | null> {
    const baseUrl = '/system/update';
    const result = await api.create<{ log: string }>(baseUrl, {}, true)
        .then((resp: any) => resp.result);
    return result !== undefined ? result : null;
}

export { getDashboardStats, updateSystem };
