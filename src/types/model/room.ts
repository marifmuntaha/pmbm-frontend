export type RoomType = {
    id?: number,
    name: string,
    capacity: number | undefined,
    createdBy?: number
    updatedBy?: number
}

export type RoomFormType = {
    id?: number | undefined,
    name: string,
    capacity: number | undefined
}
