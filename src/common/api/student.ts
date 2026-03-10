import { apiCore } from "@/common/api/core";
import type {
    ApiResponseInterface,
    StudentBoardingType,
    StudentDashboardType,
    StudentInvoiceType,
    StudentTreasurerType
} from "@/types";

const api = new apiCore()

async function studentDashboard(params: Record<string, any> = {}, notification: boolean = false): Promise<StudentDashboardType | undefined> {
    const baseUrl = '/student/dashboard'
    const result = await api.get<StudentDashboardType>(baseUrl, params, notification)
        .then((value: ApiResponseInterface<StudentDashboardType>) => value.result);
    return result !== undefined ? result : undefined;
}

async function studentTreasurer(params: Record<string, any> = {}, notification: boolean = false): Promise<StudentTreasurerType[] | []> {
    const baseUrl = '/student/treasurer';
    const result = await api.get<StudentTreasurerType[]>(baseUrl, params, notification)
        .then((value: ApiResponseInterface<StudentTreasurerType[]>) => value.result);
    return result !== undefined ? result : [];
}

async function studentInvoice(params: Record<string, any> = {}, notification: boolean = false): Promise<StudentInvoiceType[] | []> {
    const baseUrl = '/student/invoice';
    const result = await api.get<StudentInvoiceType[]>(baseUrl, params, notification)
        .then((value: ApiResponseInterface<StudentInvoiceType[]>) => value.result);
    return result !== undefined ? result : [];
}

async function studentBoarding(params: Record<string, any> = {}, notification: boolean = false): Promise<StudentBoardingType[] | []> {
    const baseUrl = '/student/boarding';
    const result = await api.get<StudentBoardingType[]>(baseUrl, params, notification)
        .then((value: ApiResponseInterface<StudentBoardingType[]>) => value.result);
    return result !== undefined ? result : [];
}
async function updateStudentProgram(id: number, params: Record<string, any> = {}, notification: boolean = true) {
    const baseUrl = `/student/program/${id}`;
    return await api.update(baseUrl, params, notification).then((resp) => resp);
}

export { studentDashboard, studentInvoice, studentTreasurer, studentBoarding, updateStudentProgram };