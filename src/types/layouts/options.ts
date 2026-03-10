export type OptionsType = {
    value: number,
    label: string,
    data?: any,
    icon?: string,
}

export type OptionGroupType = {
    label: string,
    options: OptionsType[]
}