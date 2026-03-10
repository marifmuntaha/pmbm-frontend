import {createContext, use} from "react";
import type {YearType} from "@/types";

export const YearContext = createContext<YearType|undefined>(undefined)

export function useYearContext(): YearType | undefined {
    const context = use(YearContext);
    if (!context) {
        throw new Error('useYearContext must be used within a YearProvider');
    }
    return context;
}