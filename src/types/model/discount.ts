import type {ProductType} from "@/types";

export type DiscountType = {
    id?: number;
    yearId?: number;
    institutionId?: number;
    productId?: number;
    name: string;
    description: string;
    price: string;
    unit: number;
    product?: ProductType;
    createdBy?: number;
    updatedBy?: number;
}