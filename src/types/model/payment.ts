export type PaymentChannelType = {
    group: string,
    code: string,
    name: string,
    type: string,
    fee_merchant: {
        flat: number | null,
        percent: number | null,
    },
    fee_customer: {
        flat: number | null,
        percent: number | null,
    },
    total_fee: {
        flat: number | null,
        percent: string
    },
    minimum_fee: number | null,
    maximum_fee: number | null,
    minimum_amount: number | null,
    maximum_amount: number | null,
    icon_url: string,
    active: boolean
}

export type PaymentStoreType = {
    code?: string,
    reference?: string,
    amount: number,
    studentName?: string,
    userEmail?: string,
    userPhone?: string,
}



export type PaymentModalType = {
    verification: boolean,
    create: boolean,
}

export type PaymentType = {
    id: number;
    userId: number;
    invoiceId: number;
    name: string;
    reference: string;
    method: number;
    status: number;
    transaction_id: string;
    transaction_time: string;
    amount: number;
    created_at: string;
}