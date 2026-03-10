import type { BoardingType, InstitutionPeriodType, InstitutionProgramType, InstitutionType, OptionsType, RoomType } from "@/types";

export type StudentPersonalType = {
    id?: number
    userId?: number;
    name: string
    nisn?: string
    nik: string
    gender: number
    birthPlace: string
    birthDate: string
    phone: string
    birthNumber: string
    sibling: string
    createdBy?: number
    updatedBy?: number
    created_at?: string
    updated_at?: string
}

export type StudentPersonalFormType = {
    id?: number
    name: string
    nisn?: string
    nik: string
    gender: number
    birthPlace: string
    birthDate: Date
    phone: string
    birthNumber: string
    sibling: string
}

export type StudentParentType = {
    id?: number
    userId?: number
    numberKk: string
    headFamily: string
    fatherStatus: number
    fatherName: string
    fatherNik: string
    fatherBirthPlace: string
    fatherBirthDate: string
    fatherStudy: number
    fatherJob: number
    fatherPhone: string
    motherStatus: number
    motherName: string
    motherNik: string
    motherBirthPlace: string
    motherBirthDate: string
    motherStudy: number
    motherJob: number
    motherPhone: string
    guardStatus: number
    guardName: string
    guardNik: string
    guardBirthPlace: string
    guardBirthDate: string
    guardStudy: number
    guardJob: number
    guardPhone: string
    createdBy?: number
    updatedBy?: number
    created_at?: string
    updated_at?: string
}


export type StudentParentFormType = {
    id?: number
    numberKk: string
    headFamily: string
    fatherStatus?: OptionsType
    fatherName: string
    fatherNik: string
    fatherBirthPlace: string
    fatherBirthDate: Date
    fatherStudy?: OptionsType
    fatherJob?: OptionsType
    fatherPhone: string
    motherStatus?: OptionsType
    motherName: string
    motherNik: string
    motherBirthPlace: string
    motherBirthDate: Date
    motherStudy?: OptionsType
    motherJob?: OptionsType
    motherPhone: string
    guardStatus?: OptionsType
    guardName: string
    guardNik: string
    guardBirthPlace: string
    guardBirthDate: Date
    guardStudy?: OptionsType
    guardJob?: OptionsType
    guardPhone: string
}

export type StudentAddressType = {
    id?: number
    userId?: number
    province: string
    city: string
    district: string
    village: string
    street: string
    rt: string
    rw: string
    postal: string
    createdBy?: number
    updatedBy?: number
    created_at?: string
    updated_at?: string
}

export type StudentAddressFormType = {
    id?: number
    province: OptionsType
    city: OptionsType
    district: OptionsType
    village: OptionsType
    street: string
    rt: string
    rw: string
    postal: string
    createdBy?: number
    updatedBy?: number
    created_at?: string
    updated_at?: string
}

export type StudentProgramType = {
    id?: number
    userId?: number
    yearId?: number
    institutionId?: number
    periodId?: number
    programId?: number
    boardingId?: number
    registration_number?: string
    institution?: InstitutionType
    period?: InstitutionPeriodType
    program?: InstitutionProgramType
    boarding?: BoardingType
    room?: RoomType
    createdBy?: string
    updatedBy?: string
    created_at?: string
    updated_at?: string
}

export type StudentOriginType = {
    id?: number
    userId?: number
    name: string
    npsn: string
    address: string
    createdBy?: number
    updatedBy?: number
    created_at?: string
    updated_at?: string
}

export type StudentAchievementType = {
    id?: number
    yearId?: number
    userId?: number
    level?: number
    champ?: number
    type?: number
    name: string
    file: string
    image?: any
    createdBy?: number
    updatedBy?: number
    created_at?: string
    updated_at?: string
}

export type StudentFileType = {
    id?: number
    userId?: number
    filePhoto: string
    fileKk: string
    fileKtp: string
    numberAkta: string
    fileAkta: string
    numberIjazah: string
    fileIjazah: string
    numberSkl: string
    fileSkl: string
    numberKip: string
    fileKip: string
    createdBy?: number
    updatedBy?: number
    created_at?: string
    updated_at?: string
}

export type StudentFileFormType = {
    id?: number
    userId?: number
    imagePhoto: any
    imageKk: any
    imageKtp: any
    numberAkta: string
    imageAkta: any
    numberIjazah: string
    imageIjazah: any
    numberSkl: string
    imageSkl: any
    numberKip: string
    imageKip: any
}

export type StudentVerificationType = {
    id?: number
    userId?: number
    twins: number
    twinsName?: string
    graduate: number
    domicile: number
    student: number
    teacherSon: number
    sibling: number
    siblingInstitution?: number
    siblingName?: string
}

export type StudentVerificationFormType = {
    id?: number
    userId?: number
    twins: OptionsType
    twinsName?: string
    graduate: OptionsType
    domicile: OptionsType
    student: OptionsType
    teacherSon: OptionsType
    sibling: OptionsType
    siblingInstitution?: OptionsType
    siblingName?: string
}