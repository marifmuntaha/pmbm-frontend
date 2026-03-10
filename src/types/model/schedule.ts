import type { InstitutionType } from "./institution";

export interface ScheduleItem {
    id: number;
    name: string;
    description: string;
    start: string;
    end: string;
    institution: InstitutionType;
}

export interface ScheduleData {
    status: string;
    year: string;
    schedules: ScheduleItem[];
}
