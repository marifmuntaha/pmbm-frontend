import type {InstitutionType} from "@/types";

export type UserType = {
    id?: number,
    institutionId?: number,
    name: string,
    email: string,
    password?: string,
    password_confirmation?: string,
    role: number
    phone: string,
    phone_verified_at?: string
    createdBy?: number,
    updatedBy?: number,
    created_at?: string,
    updated_at?: string,
    institution?: Partial<InstitutionType>
}