import type { OptionsType } from "@/types";
import { GUARD_STATUS, PARENT_JOB, PARENT_STATUS, PARENT_STUDY } from "@/common/constants/layout";

export const GENDER_OPTIONS: OptionsType[] = [
    { value: 1, label: 'Laki-laki' },
    { value: 2, label: 'Perempuan' }
]

export const PARENT_STATUS_OPTIONS: OptionsType[] = PARENT_STATUS.map((item) => {
    return { value: item.id, label: item.name };
})

export const GUARD_STATUS_OPTIONS: OptionsType[] = GUARD_STATUS.map((item) => {
    return { value: item.id, label: item.name };
})

export const PARENT_STUDY_OPTIONS: OptionsType[] = PARENT_STUDY.map((item) => {
    return { value: item.id, label: item.name };
})

export const PARENT_JOB_OPTIONS: OptionsType[] = PARENT_JOB.map((item) => {
    return { value: item.id, label: item.name };
})

export const LEVEL_ACHIEVEMENT_OPTIONS: OptionsType[] = [
    { value: 1, label: 'Internasional' },
    { value: 2, label: 'Nasional' },
    { value: 3, label: 'Provinsi' },
    { value: 4, label: 'Kabupaten' },
]

export const CHAMP_ACHIEVEMENT_OPTIONS: OptionsType[] = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: 'Harapan 1' },
    { value: 4, label: 'Harapan 2' },
    { value: 4, label: 'Harapan 3' },
]

export const TYPE_ACHIEVEMENT_OPTIONS: OptionsType[] = [
    { value: 1, label: 'Individu' },
    { value: 2, label: 'Kelompok' },
]

export const UNIT_OPTIONS: OptionsType[] = [
    { value: 1, label: 'Rp.' },
    { value: 2, label: '%' },
]

export const STUDENT_STATUS: OptionsType[] = [
    {value: 1, label: "Aktif"},
    {value: 2, label: "Mengundurkan Diri" },
]