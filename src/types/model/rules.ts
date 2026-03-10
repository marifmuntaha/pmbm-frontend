export type RuleType = {
    id: number;
    content: string;
    institutionId?: number;
}

export type InstitutionRuleType = {
    id: number;
    name: string;
    surname: string;
    logo: string;
    rules: RuleType[];
}

export type RulesDataType = {
    status: string;
    general: RuleType[];
    institutions: InstitutionRuleType[];
}
