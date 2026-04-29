import { apiCore } from "@/common/api/core";
import type { ApiResponseInterface } from "@/types";

const api = new apiCore();

async function testWhatsAppMessage(phone: string): Promise<ApiResponseInterface<any>> {
    const baseUrl = '/system/test/whatsapp/message';
    return await api.create(baseUrl, { phone }, true);
}

async function testWhatsAppPdf(phone: string): Promise<ApiResponseInterface<any>> {
    const baseUrl = '/system/test/whatsapp/pdf';
    return await api.create(baseUrl, { phone }, true);
}

async function testMidtrans(invoiceReference?: string): Promise<ApiResponseInterface<any>> {
    const baseUrl = '/system/test/midtrans';
    const payload = invoiceReference ? { invoice_reference: invoiceReference } : {};
    return await api.create(baseUrl, payload, true);
}

async function testPdfSignature(): Promise<ApiResponseInterface<any>> {
    const baseUrl = '/system/test/pdf/signature';
    return await api.create(baseUrl, {}, true);
}

async function testMidtransCallback(data: { order_id: string, status: string }): Promise<ApiResponseInterface<any>> {
    const baseUrl = '/system/test/midtrans/callback';
    return await api.create(baseUrl, data, true);
}

export { testWhatsAppMessage, testWhatsAppPdf, testMidtrans, testPdfSignature, testMidtransCallback };
