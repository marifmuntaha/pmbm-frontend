import React from "react";
import { Row } from "reactstrap";
import { Controller, type UseFormReturn } from "react-hook-form";
import { RSelect } from "@/components";
import { GENDER_OPTIONS } from "@/common/constants";
import DatePicker, { registerLocale } from "react-datepicker";
import { id } from "date-fns/locale/id";
import type { StudentPersonalFormType } from "@/types";

registerLocale('id', id)

interface StudentPersonalFormProps {
    methods: UseFormReturn<StudentPersonalFormType>
}

const StudentPersonalForm = ({ methods }: StudentPersonalFormProps) => {
    const { control, register, formState: { errors } } = methods
    return (
        <Row className="gy-0">
            <div className="form-group col-md-12">
                <label className="form-label" htmlFor="name">Nama Lengkap</label>
                <div className="form-control-wrap">
                    <input
                        type="text"
                        id="name"
                        className="form-control"
                        placeholder="Ex. Achmad Wikramawardhana"
                        {...register('name', { required: 'Kolom tidak boleh kosong' })}
                    />
                    {errors.name && <span className="invalid">{errors.name.message}</span>}
                </div>
            </div>
            <div className="form-group col-md-6">
                <label className="form-label" htmlFor="nisn">NISN</label>
                <div className="form-control-wrap">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ex. 1234567890 / Kosongkan jika tidak tahu"
                        {...register('nisn', {
                            required: false,
                            pattern: {
                                value: /^\d{10}$/,
                                message: "NISN harus terdiri dari 10 digit angka"
                            }
                        })}
                    />
                    {errors.nisn && <span className="invalid">{errors.nisn.message}</span>}
                </div>
            </div>
            <div className="form-group col-md-6">
                <label className="form-label" htmlFor="nik">NIK</label>
                <div className="form-control-wrap">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ex. 1234512345123456"
                        {...register('nik', {
                            required: 'Kolom tidak boleh kosong',
                            pattern: {
                                value: /^\d{16}$/,
                                message: "NIK harus terdiri dari 16 digit angka"
                            }
                        })}
                    />
                    {errors.nik && <span className="invalid">{errors.nik.message}</span>}
                </div>
            </div>
            <div className="form-group col-md-4">
                <label className="form-label" htmlFor="gender">Jenis Kelamin</label>
                <div className="form-control-wrap">
                    <Controller
                        name="gender"
                        control={control}
                        rules={{ required: 'Jenis Kelamin tidak boleh kosong' }}
                        render={({ field: { onChange, value } }) => (
                            <React.Fragment>
                                <RSelect
                                    id="gender"
                                    options={GENDER_OPTIONS}
                                    value={GENDER_OPTIONS.find((item) => item.value === value)}
                                    onChange={(val) => onChange(val?.value)}
                                    placeholder="Pilih Jenis Kelamin"
                                />
                                <input type="hidden" className="form-control" id="gender" />
                                {errors.gender && <span className="invalid">{errors.gender.message}.</span>}
                            </React.Fragment>
                        )}
                    />
                </div>
            </div>
            <div className="form-group col-md-4">
                <label className="form-label" htmlFor="birthPlace">Tempat Lahir</label>
                <div className="form-control-wrap">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ex. Jepara"
                        {...register('birthPlace', { required: 'Kolo tidak boleh kosong', })}
                    />
                    {errors.birthPlace && <span className="invalid">{errors.birthPlace.message}</span>}
                </div>
            </div>
            <div className="form-group col-md-4">
                <label className="form-label" htmlFor="birthdate">Tanggal Lahir</label>
                <div className="form-control-wrap">
                    <Controller
                        name="birthDate"
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
                                />
                                <input type="hidden" className="form-control" id="birthDate" />
                                {errors.birthDate && <span className="invalid">{errors.birthDate.message}</span>}
                            </React.Fragment>
                        )}
                    />
                </div>
            </div>
            <div className="form-group col-md-4">
                <label className="form-label" htmlFor="phone">Nomor HP</label>
                <div className="form-control-wrap">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ex. 6282229366509"
                        {...register('phone', { required: 'Kolom tidak boleh kosong' })}
                    />
                    {errors.phone && <span className="invalid">{errors.phone.message}</span>}
                </div>
            </div>
            <div className="form-group col-md-4">
                <label className="form-label" htmlFor="birthNumber">Anak Ke-</label>
                <div className="form-control-wrap">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ex. 1"
                        {...register('birthNumber', { required: 'Kolom tidak boleh kosong' })}
                    />
                    {errors.birthNumber && <span className="invalid">{errors.birthNumber.message}</span>}
                </div>
            </div>
            <div className="form-group col-md-4">
                <label className="form-label" htmlFor="sibling">Jumlah Saudara</label>
                <div className="form-control-wrap">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ex. 2"
                        {...register('sibling', { required: 'Kolom tidak boleh kosong' })}
                    />
                    {errors.sibling && <span className="invalid">{errors.sibling.message}</span>}
                </div>
            </div>
        </Row>
    )
}

export default StudentPersonalForm