export type BoardingType = {
    id?: number,
    name: string,
    surname: string,
    description?: string,
    createdBy?: number
    updatedBy?: number
}

export type BoardingFormType = {
    id?: number | undefined,
    name: string,
    surname: string,
    description?: string,
}