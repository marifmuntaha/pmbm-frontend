export type InvoiceType = {
    id?: number;
    yearId?: number;
    institutionId?: number;
    userId?: number;
    reference?: string
    studentName?: string;
    name: string;
    amount: number;
    original_amount?: number;
    dueDate: string;
    status: string;
    link?: string;
    createdBy?: number;
    updatedBy?: number;
    created_at?: string;
    updated_at?: string;
}

export type InvoiceDetailType = {
    id?: number;
    invoiceId?: number;
    productId?: number;
    name: string;
    price: number;
    discount: number;
    amount: number;
}

export type PaymentLogType = {
    id: number;
    method: number;
    amount: number;
    status: number;
    transaction_time: string;
    created_at: string;
}

export type InvoicePrintType = {
    id?: number;
    institutionLogo: string;
    invoiceReference: string;
    studentName: string;
    studentAddress: string;
    invoiceCreated?: string;
    userPhone: string;
    invoiceDueDate: string;
    invoiceStatus: string;
    invoiceDetails: InvoiceDetailType[];
    invoicePayments: PaymentLogType[];
}