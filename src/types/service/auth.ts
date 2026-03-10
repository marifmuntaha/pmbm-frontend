import type {UserType} from "@/types";

export type AuthenticationType  = {
    user?: UserType;
    token: string;
}

export type VerifyPhoneType = {
    email: string;
    otp?: string;
}

export type LoginFormType = {
    email: string;
    password: string;
}

export type RegisterFormType = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone: string;
    role: 1|2|3|4|5|6|7;
}