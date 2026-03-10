export type LandingRegistrantType = {
    id: number;
    name: string;
    guardian: string;
    address: string;
    institution: string;
}

export type LandingBrochureType = {
    id: number;
    brochure: string;
    institution: {
        name: string;
        surname: string;
        logo: string;
    };
}

export type LandingInstitutionType = {
    id: number;
    name: string;
    surname: string;
    logo: string;
    registrants_count: number;
    period: {
        id: number;
        start: string;
        end: string;
        name: string;
        description: string;
    } | null;
}

export type LandingDataType = {
    registrants_count: number;
    year: string;
    institutions: LandingInstitutionType[];
    registrants: LandingRegistrantType[];
    brochures: LandingBrochureType[];
}
