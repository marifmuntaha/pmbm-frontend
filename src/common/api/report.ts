import { apiCore } from "@/common/api/core";
import type { ApiResponseInterface } from "@/types";

const api = new apiCore()

async function getInvoiceReport<T>(params: Record<string, any> = {}): Promise<T[]> {
    const baseUrl = '/report/invoice'
    const result = await api.get<T[]>(baseUrl, params, false)
        .then((value: ApiResponseInterface<T[]>) => value.result);
    return result !== undefined ? result : [];
}

async function getPaymentReport<T>(params: Record<string, any> = {}): Promise<T[]> {
    const baseUrl = '/report/payment'
    const result = await api.get<T[]>(baseUrl, params, false)
        .then((value: ApiResponseInterface<T[]>) => value.result);
    return result !== undefined ? result : [];
}

async function getStats<T>(params: Record<string, any> = {}): Promise<T> {
    const baseUrl = '/report/stats'
    return await api.get<T>(baseUrl, params, false)
        .then((value: ApiResponseInterface<T>) => value.result as T);
}

// Applicant Report
async function getApplicantReport<T>(params: Record<string, any> = {}): Promise<T[]> {
    const baseUrl = '/report/applicants'
    const result = await api.get<T[]>(baseUrl, params, false)
        .then((value: ApiResponseInterface<T[]>) => value.result);
    return result !== undefined ? result : [];
}

// Helper to download file from response
const downloadFile = (response: any, defaultFilename: string) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;

    const contentDisposition = response.headers['content-disposition'];
    let filename = defaultFilename;

    if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1];
        }
    }

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};

async function exportApplicantReport(params: Record<string, any> = {}): Promise<void> {
    const baseUrl = `/report/applicants/export`
    const response = await api.getFile(baseUrl, params);
    downloadFile(response, 'laporan-pendaftar.xlsx');
}

// Discount Report
async function getDiscountReport<T>(params: Record<string, any> = {}): Promise<T[]> {
    const baseUrl = '/report/discounts'
    const result = await api.get<T[]>(baseUrl, params, false)
        .then((value: ApiResponseInterface<T[]>) => value.result);
    return result !== undefined ? result : [];
}

async function getItemReport<T>(params: Record<string, any> = {}): Promise<T[]> {
    const baseUrl = '/report/item'
    const result = await api.get<T[]>(baseUrl, params, false)
        .then((value: ApiResponseInterface<T[]>) => value.result);
    return result !== undefined ? result : [];
}

async function exportItemReport(params: Record<string, any> = {}): Promise<void> {
    const baseUrl = `/report/item/export`
    const response = await api.getFile(baseUrl, params);
    downloadFile(response, 'laporan-tagihan-item.xlsx');
}

async function exportDiscountReport(params: Record<string, any> = {}): Promise<void> {
    const baseUrl = `/report/discounts/export`
    const response = await api.getFile(baseUrl, params);
    downloadFile(response, 'laporan-potongan.xlsx');
}

async function exportInvoiceReport(params: Record<string, any> = {}): Promise<void> {
    const baseUrl = `/report/invoice/export`
    const response = await api.getFile(baseUrl, params);
    downloadFile(response, 'laporan-tagihan.xlsx');
}

async function exportPaymentReport(params: Record<string, any> = {}): Promise<void> {
    const baseUrl = `/report/payment/export`
    const response = await api.getFile(baseUrl, params);
    downloadFile(response, 'laporan-pembayaran.xlsx');
}

export {
    getInvoiceReport,
    getItemReport,
    exportItemReport,
    getPaymentReport,
    getStats,
    getApplicantReport,
    exportApplicantReport,
    getDiscountReport,
    exportDiscountReport,
    exportInvoiceReport,
    exportPaymentReport
}
