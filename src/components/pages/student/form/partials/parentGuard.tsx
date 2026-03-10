import React, { useEffect } from "react";
import { Controller, type UseFormReturn, useWatch } from "react-hook-form";
import { Row, RSelect } from "@/components";
import { GUARD_STATUS_OPTIONS, PARENT_JOB_OPTIONS, PARENT_STUDY_OPTIONS } from "@/common/constants";
import DatePicker from "react-datepicker";
import type { OptionsType, StudentParentFormType } from "@/types";

interface ParentGuardFormProps {
    methods: UseFormReturn<StudentParentFormType>
}

const ParentGuardForm = ({ methods }: ParentGuardFormProps) => {
    const { register, control, formState: { errors }, getValues, setValue } = methods;
    const guardStatus: OptionsType | undefined = useWatch({ control, name: 'guardStatus' })

    useEffect(() => {
        if (guardStatus?.value === 1) {
            setValue("guardName", getValues('fatherName'))
            setValue("guardNik", getValues('fatherNik'))
            setValue("guardBirthPlace", getValues('fatherBirthPlace'))
            setValue("guardBirthDate", getValues('fatherBirthDate'))
            setValue("guardStudy", getValues('fatherStudy'))
            setValue("guardJob", getValues('fatherJob'))
            setValue("guardPhone", getValues('fatherPhone'))
        } else if (guardStatus?.value === 2) {
            setValue("guardName", getValues('motherName'))
            setValue("guardNik", getValues('motherNik'))
            setValue("guardBirthPlace", getValues('motherBirthPlace'))
            setValue("guardBirthDate", getValues('motherBirthDate'))
            setValue("guardStudy", getValues('motherStudy'))
            setValue("guardJob", getValues('motherJob'))
            setValue("guardPhone", getValues('motherPhone'))
        } else {
            setValue("guardName", getValues('guardName'))
            setValue("guardNik", getValues('guardNik'))
            setValue("guardBirthPlace", getValues('guardBirthPlace'))
            setValue("guardBirthDate", getValues('guardBirthDate'))
            setValue("guardStudy", getValues('guardStudy'))
            setValue("guardJob", getValues('guardJob'))
            setValue("guardPhone", getValues('guardPhone'))
        }
    }, [guardStatus]);

    return (
        <React.Fragment>
            <Row className="gy-0">
                <div className="form-group">
                    <label className="form-label" htmlFor="guardStatus">Status Wali</label>
                    <div className="form-control-wrap">
                        <Controller
                            name="guardStatus"
                            control={control}
                            rules={{ required: 'Status Wali tidak boleh kosong' }}
                            render={({ field: { onChange, value } }) => (
                                <React.Fragment>
                                    <RSelect
                                        id="guardStatus"
                                        options={GUARD_STATUS_OPTIONS}
                                        value={value}
                                        onChange={(val) => onChange(val)}
                                        placeholder="Pilih Status Wali"
                                    />
                                    <input type="hidden" className="form-control" id="guardStatus" />
                                    {errors.guardStatus && <span className="invalid">{errors.guardStatus.message}.</span>}
                                </React.Fragment>
                            )}
                        />
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="guardName">Nama Wali</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ex. Muhammad Arif"
                            disabled={guardStatus?.value !== 3}
                            {...register('guardName', {
                                required: 'Kolom tidak boleh kosong',
                            })}
                        />
                        {errors.guardName && <span className="invalid">{errors.guardName.message}</span>}
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="guardNik">NIK Wali</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ex. 1234512345123456"
                            disabled={guardStatus?.value !== 3}
                            {...register('guardNik', {
                                required: 'Kolom tidak boleh Kosong',
                                pattern: {
                                    value: /^\d{16}$/,
                                    message: "NIK harus terdiri dari 16 digit angka"
                                }
                            })}
                        />
                        {errors.guardNik && <span className="invalid">{errors.guardNik.message}</span>}
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="guardBirthPlace">Tempat Lahir Wali</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ex. Jepara"
                            disabled={guardStatus?.value !== 3}
                            {...register('guardBirthPlace', {
                                required: 'Kolom tidak boleh kosong',
                            })}
                        />
                        {errors.guardBirthPlace && <span className="invalid">{errors.guardBirthPlace.message}</span>}
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="guardBirthDate">Tanggal Lahir Wali</label>
                    <div className="form-control-wrap">
                        <Controller
                            name="guardBirthDate"
                            control={control}
                            rules={{ required: 'Kolom tidak boleh kosong' }}
                            render={({ field: { onChange, value } }) => (
                                <React.Fragment>
                                    <DatePicker
                                        locale="id"
                                        selected={value}
                                        onChange={(e) => onChange(e)}
                                        dateFormat={"dd/MM/yyyy"}
                                        className="form-control date-picker"
                                        placeholderText="Pilih Tanggal Lahir"
                                        disabled={guardStatus?.value !== 3}
                                    />
                                    <input type="hidden" className="form-control" id="guardBirthDate" />
                                    {errors.guardBirthDate && <span className="invalid">{errors.guardBirthDate.message}</span>}
                                </React.Fragment>
                            )}
                        />
                    </div>
                </div>
                <div className="form-group col-md-4">
                    <label className="form-label" htmlFor="guardStudy">Pendidikan Wali</label>
                    <div className="form-control-wrap">
                        <Controller
                            name="guardStudy"
                            control={control}
                            rules={{ required: 'Kolom tidak boleh kosong' }}
                            render={({ field: { onChange, value } }) => (
                                <React.Fragment>
                                    <RSelect
                                        id="guardStudy"
                                        options={PARENT_STUDY_OPTIONS}
                                        value={value}
                                        onChange={(val) => onChange(val)}
                                        placeholder="Pilih Pendidikan Wali"
                                        isDisabled={guardStatus?.value !== 3}
                                    />
                                    <input type="hidden" className="form-control" id="guardStudy" />
                                    {errors.guardStudy && <span className="invalid">{errors.guardStudy.message}.</span>}
                                </React.Fragment>
                            )}
                        />
                    </div>
                </div>
                <div className="form-group col-md-4">
                    <label className="form-label" htmlFor="guardJob">Pekerjaan Wali</label>
                    <div className="form-control-wrap">
                        <Controller
                            name="guardJob"
                            control={control}
                            rules={{ required: 'Kolom tidak boleh kosong' }}
                            render={({ field: { onChange, value } }) => (
                                <React.Fragment>
                                    <RSelect
                                        id="guardJob"
                                        options={PARENT_JOB_OPTIONS}
                                        value={value}
                                        onChange={(val) => onChange(val)}
                                        placeholder="Pilih Pekerjaan Wali"
                                        isDisabled={guardStatus?.value !== 3}
                                    />
                                    <input type="hidden" className="form-control" id="guardJob" />
                                    {errors.guardJob && <span className="invalid">{errors.guardJob.message}.</span>}
                                </React.Fragment>
                            )}
                        />
                    </div>
                </div>
                <div className="form-group col-md-4">
                    <label className="form-label" htmlFor="guardPhone">Nomor WA Wali</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ex. Jepara"
                            disabled={guardStatus?.value !== 3}
                            {...register('guardPhone', {
                                required: 'Kolom tidak boleh kosong',
                            })}
                        />
                        {errors.guardPhone && <span className="invalid">{errors.guardPhone.message}</span>}
                    </div>
                </div>
            </Row>
        </React.Fragment>
    )
}

export default ParentGuardForm;