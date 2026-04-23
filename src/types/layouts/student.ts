import type {
    AnnouncementType,
    InvoiceType,
    StudentAchievementType,
    StudentAddressType, StudentFileType,
    StudentOriginType,
    StudentParentType,
    StudentPersonalType,
    StudentProgramType, StudentVerificationType
} from "@/types";

export type StudentDashboardType = {
    totalStudent: number;
    totalInvoice: number;
    personal: Partial<StudentPersonalType>
    parent: Partial<StudentParentType>
    address: Partial<StudentAddressType>
    program: Partial<StudentProgramType>
    origin: Partial<StudentOriginType>
    achievement?: Partial<StudentAchievementType>
    files: Partial<StudentFileType>
    announcements: AnnouncementType[]
}

export type StudentOperatorType = {
    id?: number,
    userId?: number,
    name: string,
    gender?: number,
    birthPlace: string,
    birthDate: string,
    guardName: string,
    address: string,
    institution?: string,
    program: string,
    number_register: string,
    boarding: string,
    room?: string,
    verification: Partial<StudentVerificationType>
    status: number
}

export type StudentTreasurerType = {
    id?: number,
    userId?: number,
    name: string,
    birthPlace: string,
    birthDate: string,
    guardName: string,
    address: string,
    program: string,
    boarding: string,
    verification: Partial<StudentVerificationType>
}

export type StudentInvoiceType = {
    userId?: number
    name: string,
    guardName: string,
    address: string,
    gender: number,
    programId: number,
    boardingId: number,
    period?: string,
    invoice?: InvoiceType,
    program?: string
    verification?: StudentVerificationType
}

export type StudentBoardingType = {
    id?: number,
    registration_number?: string,
    institution?: string
    name: string,
    birthPlace: string,
    birthDate: string,
    gender: number,
    guardName: string,
    address: string,
    boarding: string,
    room?: string,
}