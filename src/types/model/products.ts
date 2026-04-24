import type {InstitutionProgramType} from "@/types";

export type ProductType = {
    id?: number;
    yearId?: number;
    institutionId?: number;
    name: string;
    surname: string;
    price: number|null;
    gender: number|null;
    programId: number|null;
    isBoarding: number|null;
    boardingId: number|null;
    program?: Partial<InstitutionProgramType>
    boarding?: Partial<InstitutionProgramType>
    createdBy?: number;
    updatedBy?: number;
    invoice?: number;
    discount?: number;
}