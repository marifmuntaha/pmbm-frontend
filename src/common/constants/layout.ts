import type { OptionsType } from "@/types";

export const ROLE_NAME = [
    { id: 1, name: 'Administrator' },
    { id: 2, name: 'Operator' },
    { id: 3, name: 'Bendahara' },
    { id: 4, name: 'Pendaftar' },
    { id: 5, name: 'Operator Pondok' }
]

export const SIZE = ["xs", "sm", "md", "lg", "xl"]

export const COLOR = [
    "success", "danger", "warning", "info", "primary", "secondary", "dark", "grey", "blue", "azure", "indigo", "purple", "pink", "orange", "teal", "light", "lighter", "white"
]

export const ROLE_INSTITUTION = [2, 3]

export const ROLE_OPTIONS: OptionsType[] = ROLE_NAME.map((item): OptionsType => {
    return { value: item.id, label: item.name }
})

export const PARENT_STATUS = [
    { id: 1, name: 'Masih Hidup' },
    { id: 2, name: 'Sudah Meninggal' },
    { id: 3, name: 'Tidak Diketahui' },
]
export const GUARD_STATUS = [
    { id: 1, name: 'Sama dengan Ayah Kandung' },
    { id: 2, name: 'Sama dengan Ibu Kandung' },
    { id: 3, name: 'Lainnya' },
]
export const PARENT_STUDY = [
    { id: 1, name: 'SD/Sederajat' },
    { id: 2, name: 'SMP/Sederajat' },
    { id: 3, name: 'SMA/Sederajat' },
    { id: 4, name: 'D1' },
    { id: 5, name: 'D2' },
    { id: 6, name: 'D3' },
    { id: 7, name: 'D4/S1' },
    { id: 8, name: 'S2' },
    { id: 9, name: 'S3' },
    { id: 10, name: 'Tidak Bersekolah' }
]

export const PARENT_JOB = [
    { id: 1, name: 'Tidak Bekerja' },
    { id: 2, name: 'Pensiunan' },
    { id: 3, name: 'PNS' },
    { id: 4, name: 'TNI/Polisi' },
    { id: 5, name: 'Guru/Dosen' },
    { id: 6, name: 'Pegawai Swasta' },
    { id: 7, name: 'Wiraswasta' },
    { id: 8, name: 'Pengacara/Jaksa/Hakim/Notaris' },
    { id: 9, name: 'Seniman/Pelukis/Artis/Sejenis' },
    { id: 10, name: 'Dokter/Bidan/Perawat' },
    { id: 11, name: 'Pilot/Pramugara' },
    { id: 12, name: 'Pedagang' },
    { id: 13, name: 'Petani/Peternak' },
    { id: 14, name: 'Nelayan' },
    { id: 15, name: 'Buruh (Tani/Pabrik/Bangunan)' },
    { id: 16, name: 'Sopir/Masinis/Kondektur' },
    { id: 17, name: 'Politikus' },
    { id: 18, name: 'Lainnya' },
]