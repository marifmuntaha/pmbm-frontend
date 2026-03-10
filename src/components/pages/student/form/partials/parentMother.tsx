import React from "react";
import { Controller, type UseFormReturn, useWatch } from "react-hook-form";
import { Row, RSelect } from "@/components";
import { PARENT_JOB_OPTIONS, PARENT_STATUS_OPTIONS, PARENT_STUDY_OPTIONS } from "@/common/constants";
import DatePicker from "react-datepicker";
import type { OptionsType, StudentParentFormType } from "@/types";

interface ParentMotherFormProps {
    methods: UseFormReturn<StudentParentFormType>
}
const ParentMotherForm = ({ methods }: ParentMotherFormProps) => {
    const { register, control, formState: { errors } } = methods;
    const motherStatus: OptionsType | undefined = useWatch({ control, name: 'motherStatus' })
    const motherRules: string | boolean = motherStatus?.value === 1 ? 'Kolom tidak boleh kosong.' : false
    return (
        <React.Fragment>
            <Row className="gy-0">
                <div className="form-group">
                    <label className="form-label" htmlFor="motherStatus">Status Ibu Kandung</label>
                    <div className="form-control-wrap">
                        <Controller
                            name="motherStatus"
                            control={control}
                            rules={{ required: 'Status Ibu tidak boleh kosong' }}
                            render={({ field: { onChange, value } }) => (
                                <React.Fragment>
                                    <RSelect
                                        id="motherStatus"
                                        options={PARENT_STATUS_OPTIONS}
                                        value={value}
                                        onChange={(val) => onChange(val)}
                                        placeholder="Pilih Status Ibu Kandung"
                                    />
                                    <input type="hidden" className="form-control" id="motherStatus" />
                                    {errors.motherStatus &&
                                        <span className="invalid">{errors.motherStatus.message}.</span>}
                                </React.Fragment>
                            )}
                        />
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="motherName">Nama Ibu Kandung</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ex. Robiatul Wasiah"
                            {...register('motherName', {
                                required: 'Kolom tidak boleh kosong',
                            })}
                        />
                        {errors.motherName && <span className="invalid">{errors.motherName.message}</span>}
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="motherNik">NIK Ibu Kandung</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ex. 1234512345123456"
                            disabled={!motherRules}
                            {...register('motherNik', {
                                required: motherRules,
                                pattern: {
                                    value: /^\d{16}$/,
                                    message: "NIK harus terdiri dari 16 digit angka"
                                }
                            })}
                        />
                        {errors.motherNik && <span className="invalid">{errors.motherNik.message}</span>}
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="motherBirthPlace">Tempat Lahir Ibu</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ex. Jepara"
                            disabled={!motherRules}
                            {...register('motherBirthPlace', {
                                required: motherRules,
                            })}
                        />
                        {errors.motherBirthPlace && <span className="invalid">{errors.motherBirthPlace.message}</span>}
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="motherBirthDate">Tanggal Lahir Ibu</label>
                    <div className="form-control-wrap">
                        <Controller
                            name="motherBirthDate"
                            control={control}
                            rules={{ required: motherRules }}
                            render={({ field: { onChange, value } }) => (
                                <React.Fragment>
                                    <DatePicker
                                        locale="id"
                                        selected={value}
                                        onChange={(e) => onChange(e)}
                                        dateFormat={"dd/MM/yyyy"}
                                        className="form-control date-picker"
                                        placeholderText="Pilih Tanggal Lahir"
                                        disabled={!motherRules}
                                    />
                                    <input type="hidden" className="form-control" id="motherBirthDate" />
                                    {errors.motherBirthDate && <span className="invalid">{errors.motherBirthDate.message}</span>}
                                </React.Fragment>
                            )}
                        />
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="motherStudy">Pendidikan Ibu</label>
                    <div className="form-control-wrap">
                        <Controller
                            name="motherStudy"
                            control={control}
                            rules={{ required: motherRules }}
                            render={({ field: { onChange, value } }) => (
                                <React.Fragment>
                                    <RSelect
                                        id="motherStudy"
                                        options={PARENT_STUDY_OPTIONS}
                                        value={value}
                                        onChange={(val) => onChange(val)}
                                        placeholder="Pilih Pendidikan Ibu"
                                        isDisabled={!motherRules}
                                    />
                                    <input type="hidden" className="form-control" id="motherStudy" />
                                    {errors.motherStudy && <span className="invalid">{errors.motherStudy.message}.</span>}
                                </React.Fragment>
                            )}
                        />
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="motherJob">Pekerjaan Ibu</label>
                    <div className="form-control-wrap">
                        <Controller
                            name="motherJob"
                            control={control}
                            rules={{ required: motherRules }}
                            render={({ field: { onChange, value } }) => (
                                <React.Fragment>
                                    <RSelect
                                        id="motherJob"
                                        options={PARENT_JOB_OPTIONS}
                                        value={value}
                                        onChange={(val) => onChange(val)}
                                        placeholder="Pilih Pekerjaan Ibu"
                                        isDisabled={!motherRules}
                                    />
                                    <input type="hidden" className="form-control" id="motherJob" />
                                    {errors.motherJob && <span className="invalid">{errors.motherJob.message}.</span>}
                                </React.Fragment>
                            )}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="motherPhone">Nomor WA Ibu</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ex. 6282229366500"
                            disabled={!motherRules}
                            {...register('motherPhone', {
                                required: motherRules,
                            })}
                        />
                        {errors.motherPhone && <span className="invalid">{errors.motherPhone.message}</span>}
                    </div>
                </div>
            </Row>
        </React.Fragment>
    )
}

export default ParentMotherForm;