import type { InstitutionType } from "@/types";

export type WhatsappType = {
    id?: number,
    institutionId?: number,
    device: string,
    active: 0 | 1,
    status?: any,
    createdBy?: number
    updatedBy?: number
    institution?: Partial<InstitutionType>
}