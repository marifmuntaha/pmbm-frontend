import { createContext, use } from "react";
import type { InstitutionType } from "@/types";

export const InstitutionContext = createContext<InstitutionType | undefined>(undefined)

export function useInstitutionContext(): InstitutionType | undefined {
    const context = use(InstitutionContext);
    if (!context) {
        throw new Error('useInstitutionContext must be used within an InstitutionProvider');
    }
    return context;
}