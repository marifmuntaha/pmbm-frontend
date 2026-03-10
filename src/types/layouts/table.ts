import type { JSX } from "react";

export interface ColumnType<T> {
    name: string;
    selector: (row: T) => number | string | boolean | undefined;
    sortable: boolean;
    cell?: (row: T, index?: number) => JSX.Element | any;
    width?: string;
}

export type ModalInvoiceType = {
    form: boolean;
    show: boolean;
}