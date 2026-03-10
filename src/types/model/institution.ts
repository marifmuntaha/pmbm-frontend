import type {OptionsType, YearType} from "@/types";

export type InstitutionType = {
    id: number|undefined;
    name: string,
    surname: string,
    tagline: string,
    npsn: string,
    nsm: string,
    address: string,
    phone: string,
    email: string,
    website: string,
    head: string,
    logo?: string,
    image?: any
    createdBy?: number,
    updatedBy?: number,
}

export type InstitutionFormType = {
    id?: number|undefined;
    name: string,
    surname: string,
    tagline: string,
    npsn: string,
    nsm: string,
    address: string,
    phone: string,
    email: string,
    website: string,
    head: string,
    file?: any,
}

export type InstitutionActivityType = {
    id?: number|undefined;
    yearId: number|undefined;
    institutionId: number|string|undefined;
    capacity: string,
    brochure?: string,
    file?: any
    createdBy?: number|undefined,
    updatedBy?: number|undefined,
    year?: YearType|undefined,
    institution?: InstitutionType|undefined,
}

export type InstitutionActivityFormType = {
    id?: number|undefined;
    yearId: number|undefined;
    institutionId: number|string|undefined;
    capacity: string,
    file: any,
}

export type InstitutionProgramType = {
    id?: number;
    yearId?: number;
    institutionId?: number;
    name: string,
    alias: string,
    description: string,
    boarding: string,
    createdBy?: string,
    updatedBy?: string,
}

export type InstitutionProgramFormType = {
    id?: number;
    yearId?: number;
    institutionId?: number;
    name: string,
    alias: string,
    description: string,
    boarding: OptionsType[]
}

export type InstitutionPeriodType = {
    id?: number|undefined;
    yearId: number|undefined;
    institutionId: number|string|undefined;
    name: string,
    description: string|undefined,
    start: string|undefined,
    end: string|undefined,
    createdBy?: string,
    updatedBy?: string,
}

export type InstitutionPeriodFormType = {
    id?: number|undefined;
    yearId: number|undefined;
    institutionId: number|string|undefined;
    name: string,
    description: string|undefined,
    start: Date|undefined,
    end: Date|undefined,
}