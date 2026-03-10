export * from "./layouts"
export * from "./model"
export * from "./service"
export interface RuleType {
    id?: number
    institutionId?: number | null
    content: string
}