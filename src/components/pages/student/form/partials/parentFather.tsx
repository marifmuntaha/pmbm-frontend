import React from "react";
import { Controller, type UseFormReturn, useWatch } from "react-hook-form";
import { Row, RSelect } from "@/components";
import { PARENT_JOB_OPTIONS, PARENT_STATUS_OPTIONS, PARENT_STUDY_OPTIONS } from "@/common/constants";
import DatePicker from "react-datepicker";
import type { OptionsType, StudentParentFormType } from "@/types";

interface ParentFatherFormProps {
    methods: UseFormReturn<StudentParentFormType>
}
const ParentFatherForm = ({ methods }: ParentFatherFormProps) => {
    const { register, control, formState: { errors } } = methods;
    const fatherStatus: OptionsType | undefined = useWatch({ control, name: 'fatherStatus' })
    const fatherRules: string | boolean = fatherStatus?.value === 1 ? 'Kolom tidak boleh kosong.' : false
    return (
        <React.Fragment>
            <Row className="gy-0">
                <div className="form-group">
                    <label className="form-label" htmlFor="fatherStatus">Status Ayah Kandung</label>
                    <div className="form-control-wrap">
                        <Controller
                            name="fatherStatus"
                            control={control}
                            rules={{ required: 'Status Ayah tidak boleh kosong' }}
                            render={({ field: { onChange, value } }) => (
                                <React.Fragment>
                                    <RSelect
                                        id="fatherStatus"
                                        options={PARENT_STATUS_OPTIONS}
                                        value={value}
                                        onChange={(val) => onChange(val)}
                                        placeholder="Pilih Status Ayah Kandung"
                                    />
                                    <input type="hidden" className="form-control" id="fatherStatus" />
                                    {errors.fatherStatus &&
                                        <span className="invalid">{errors.fatherStatus.message}.</span>}
                                </React.Fragment>
                            )}
                        />
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="fatherName">Nama Ayah Kandung</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ex. Muhammad Arif"
                            {...register('fatherName', {
                                required: 'Kolom tidak boleh kosong',
                            })}
                        />
                        {errors.fatherName && <span className="invalid">{errors.fatherName.message}</span>}
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="fatherNik">NIK Ayah Kandung</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ex. 1234512345123456"
                            disabled={!fatherRules}
                            {...register('fatherNik', {
                                required: fatherRules,
                                pattern: {
                                    value: /^\d{16}$/,
                                    message: "NIK harus terdiri dari 16 digit angka"
                                }
                            })}
                        />
                        {errors.fatherNik && <span className="invalid">{errors.fatherNik.message}</span>}
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="fatherBirthPlace">Tempat Lahir Ayah</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ex. Jepara"
                            disabled={!fatherRules}
                            {...register('fatherBirthPlace', {
                                required: fatherRules,
                            })}
                        />
                        {errors.fatherBirthPlace && <span className="invalid">{errors.fatherBirthPlace.message}</span>}
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="fatherBirthDate">Tanggal Lahir Ayah</label>
                    <div className="form-control-wrap">
                        <Controller
                            name="fatherBirthDate"
                            control={control}
                            rules={{ required: fatherRules }}
                            render={({ field: { onChange, value } }) => (
                                <React.Fragment>
                                    <DatePicker
                                        locale="id"
                                        selected={value}
                                        onChange={(e) => onChange(e)}
                                        dateFormat={"dd/MM/yyyy"}
                                        className="form-control date-picker"
                                        placeholderText="Pilih Tanggal Lahir"
                                        disabled={!fatherRules}
                                    />
                                    <input type="hidden" className="form-control" id="fatherBirthDate" />
                                    {errors.fatherBirthDate && <span className="invalid">{errors.fatherBirthDate.message}</span>}
                                </React.Fragment>
                            )}
                        />
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="fatherStudy">Pendidikan Ayah</label>
                    <div className="form-control-wrap">
                        <Controller
                            name="fatherStudy"
                            control={control}
                            rules={{ required: fatherRules }}
                            render={({ field: { onChange, value } }) => (
                                <React.Fragment>
                                    <RSelect
                                        id="fatherStudy"
                                        options={PARENT_STUDY_OPTIONS}
                                        value={value}
                                        onChange={(val) => onChange(val)}
                                        placeholder="Pilih Pendidikan Ayah"
                                        isDisabled={!fatherRules}
                                    />
                                    <input type="hidden" className="form-control" id="fatherStudy" />
                                    {errors.fatherStudy && <span className="invalid">{errors.fatherStudy.message}.</span>}
                                </React.Fragment>
                            )}
                        />
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="fatherJob">Pekerjaan Ayah</label>
                    <div className="form-control-wrap">
                        <Controller
                            name="fatherJob"
                            control={control}
                            rules={{ required: fatherRules }}
                            render={({ field: { onChange, value } }) => (
                                <React.Fragment>
                                    <RSelect
                                        id="fatherJob"
                                        options={PARENT_JOB_OPTIONS}
                                        value={value}
                                        onChange={(val) => onChange(val)}
                                        placeholder="Pilih Pekerjaan Ayah"
                                        isDisabled={!fatherRules}
                                    />
                                    <input type="hidden" className="form-control" id="fatherJob" />
                                    {errors.fatherJob && <span className="invalid">{errors.fatherJob.message}.</span>}
                                </React.Fragment>
                            )}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="fatherPhone">Nomor WA Ayah</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ex. 6282229300899"
                            disabled={!fatherRules}
                            {...register('fatherPhone', {
                                required: fatherRules,
                            })}
                        />
                        {errors.fatherPhone && <span className="invalid">{errors.fatherPhone.message}</span>}
                    </div>
                </div>
            </Row>
        </React.Fragment>
    )
}

export default ParentFatherForm;