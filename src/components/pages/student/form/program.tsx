import React, {useEffect, useState} from "react";
import type {InstitutionPeriodType, OptionsType, StudentProgramType, UserType} from "@/types";
import {Row} from "reactstrap";
import {Controller, type UseFormReturn, useWatch} from "react-hook-form";
import {RSelect} from "@/components";
import {useYearContext} from "@/common/hooks/useYearContext";
import {get as getInstitution} from "@/common/api/institution";
import {get as getInstitutionPrograms} from "@/common/api/institution/program";
import {get as getPeriod} from "@/common/api/institution/period";
import moment from "moment";

interface StudentProgramFormProps {
    methods: UseFormReturn<StudentProgramType>
    user?: UserType
    period?: InstitutionPeriodType
    setPeriod: (value: InstitutionPeriodType) => void
}
const StudentProgramForm = ({methods, user}: StudentProgramFormProps) => {
    const year = useYearContext()
    const {control, formState: {errors}, setValue} = methods;
    const [institutionOptions, setInstitutionOptions] = useState<OptionsType[]>()
    const [programOptions, setProgramOptions] = useState<OptionsType[]>()
    const [boardingOptions, setBoardingOptions] = useState<OptionsType[]>()
    const [periodOptions, setPeriodOptions] = useState<OptionsType[]>()

    const institutionSelected = useWatch({control, name: 'institutionId'}) ?? ''
    const programSelected = useWatch({control, name: 'programId'}) ?? ''

    useEffect(() => {
        getInstitution<OptionsType>({type: 'select'}).then((resp) => setInstitutionOptions(resp))
    }, []);

    useEffect(() => {
        if (institutionSelected) {
            getInstitutionPrograms<OptionsType>({
                institutionId: institutionSelected,
                type: 'select',
                with: 'boarding'
            }).then((resp) => setProgramOptions(resp))
            if (user?.role === 4) {
                getPeriod<InstitutionPeriodType>({
                    yearId: year?.id,
                    institutionId: institutionSelected,
                    date: moment().format('YYYY-MM-DD')
                }).then((resp) => {
                    const result = resp[0]
                    setValue('periodId', result.id)
                })
            }
            if (user?.role === 2) {
                getPeriod<OptionsType>({yearId: year?.id, institutionId: institutionSelected, type: 'select'}).then((resp) => {
                    setPeriodOptions(resp)
                })
            }
        }

    }, [institutionSelected]);

    useEffect(() => {
        const handleBoarding = () => {
            const boarding = programOptions?.find((item) => item.value === programSelected)
            if (boarding !== undefined) setBoardingOptions(JSON.parse(boarding?.data))
        }
        handleBoarding()
    }, [programSelected, programOptions]);

    return (

            <Row className="gy-1">
                {user?.role === 4 && (
                    <div className="form-group col-md-4">
                        <label className="form-label" htmlFor="institutionId">Lembaga</label>
                        <div className="form-control-wrap">
                            <Controller
                                name="institutionId"
                                control={control}
                                rules={{required: 'Lembaga tidak boleh kosong'}}
                                render={({field: {onChange, value}}) => (
                                    <React.Fragment>
                                        <RSelect
                                            id="institutionId"
                                            options={institutionOptions}
                                            value={institutionOptions?.find((item) => item.value === value)}
                                            onChange={(val) => onChange(val?.value)}
                                            placeholder="Pilih Lembaga"
                                        />
                                        <input type="hidden" className="form-control" id="institutionId"/>
                                        {errors.institutionId && <span className="invalid">{errors.institutionId.message}.</span>}
                                    </React.Fragment>
                                )}
                            />
                        </div>
                    </div>
                )}
                {user?.role === 2 && (
                    <div className="form-group col-md-4">
                        <label className="form-label" htmlFor="periodId">Gelombang</label>
                        <div className="form-control-wrap">
                            <Controller
                                name="periodId"
                                control={control}
                                rules={{required: 'Gelombang tidak boleh kosong'}}
                                render={({field: {onChange, value}}) => (
                                    <React.Fragment>
                                        <RSelect
                                            id="periodId"
                                            options={periodOptions}
                                            value={periodOptions?.find((item) => item.value === value)}
                                            onChange={(val) => onChange(val?.value)}
                                            placeholder="Pilih Gelombang"
                                        />
                                        <input type="hidden" className="form-control" id="periodId"/>
                                        {errors.periodId && <span className="invalid">{errors.periodId.message}.</span>}
                                    </React.Fragment>
                                )}
                            />
                        </div>
                    </div>
                )}
                <div className="form-group col-md-4">
                    <label className="form-label" htmlFor="programId">Program Madrasah</label>
                    <div className="form-control-wrap">
                        <Controller
                            name="programId"
                            control={control}
                            rules={{required: 'Program tidak boleh kosong'}}
                            render={({field: {onChange, value}}) => (
                                <React.Fragment>
                                    <RSelect
                                        id="programId"
                                        options={programOptions}
                                        value={programOptions?.find((item) => item.value === value)}
                                        onChange={(val) => onChange(val?.value)}
                                        placeholder="Pilih Program"
                                    />
                                    <input type="hidden" className="form-control" id="programId"/>
                                    {errors.programId && <span className="invalid">{errors.programId.message}.</span>}
                                </React.Fragment>
                            )}
                        />
                    </div>
                </div>
                <div className="form-group col-md-4">
                    <label className="form-label" htmlFor="boardingId">Program Boarding</label>
                    <div className="form-control-wrap">
                        <Controller
                            name="boardingId"
                            control={control}
                            rules={{required: 'Program tidak boleh kosong'}}
                            render={({field: {onChange, value}}) => (
                                <React.Fragment>
                                    <RSelect
                                        id="boardingId"
                                        options={boardingOptions}
                                        value={boardingOptions?.find((item) => item.value === value)}
                                        onChange={(val) => onChange(val?.value)}
                                        placeholder="Pilih Program"
                                    />
                                    <input type="hidden" className="form-control" id="boardingId"/>
                                    {errors.boardingId && <span className="invalid">{errors.boardingId.message}.</span>}
                                </React.Fragment>
                            )}
                        />
                    </div>
                </div>
            </Row>
    )
}

export default StudentProgramForm