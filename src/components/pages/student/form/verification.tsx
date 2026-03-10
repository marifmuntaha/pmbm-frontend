import React, { useEffect, useState } from "react";
import { Col, RSelect, Row } from "@/components";
import { Controller, type UseFormReturn, useWatch } from "react-hook-form";
import type { StudentVerificationFormType, OptionsType, UserType, InstitutionType, } from "@/types";
import { get as getInstitution } from "@/common/api/institution";

interface StudentVerificationFormProps {
    user?: UserType
    methods: UseFormReturn<StudentVerificationFormType>
}

const StudentVerificationForm = ({ user, methods }: StudentVerificationFormProps) => {
    const { control, register, formState: { errors } } = methods;
    const [institution, setInstitution] = useState<InstitutionType>()
    const [institutionBefore, setInstitutionBefore] = useState<InstitutionType>()
    const [institutionOptions, setInstitutionOptions] = useState<OptionsType[]>()
    const twinsSelected = useWatch({ control, name: 'twins' })
    const siblingSelected: OptionsType = useWatch({ control, name: 'sibling' })
    const siblingRules = siblingSelected?.value === 1 ? { required: 'Kolom tidak boleh kosong' } : { required: false }
    const statusOptions: OptionsType[] = [
        { value: 2, label: "Tidak" },
        { value: 1, label: "Ya" },
    ];

    useEffect(() => {
        getInstitution<InstitutionType>().then((respInstitutions) => {
            const idBefore = user?.institutionId ? user.institutionId - 1 : null
            setInstitution(respInstitutions.find((item) => item.id === user?.institutionId))
            setInstitutionBefore(respInstitutions.find((item) => item.id === idBefore))
            if (respInstitutions.length > 0) {
                const institutionOptions: OptionsType[] = respInstitutions.map((item): OptionsType => {
                    return { value: item.id ? item.id : 0, label: item.surname }
                })
                setInstitutionOptions(institutionOptions)
            }
        })
    }, [user]);

    return (
        <div className="mb-3">
            <Row className="g-3 align-center form-group">
                <Col lg={8}>
                    <span className="form-note">Apakah anda mempunyai kembaran yang bersekolah di {institution?.surname}?</span>
                </Col>
                <Col lg={4}>
                    <div className="form-control-wrap">
                        <Controller
                            control={control}
                            name="twins"
                            rules={{ required: "Kolom tidak boleh kosong" }}
                            render={({ field: { value, onChange } }) => (
                                <React.Fragment>
                                    <RSelect
                                        options={statusOptions}
                                        value={value}
                                        onChange={(val) => onChange(val)}
                                        placeholder="Pilih Status"
                                    />
                                    <input type="hidden" id="twins" className="form-control" />
                                    {errors.twins && <span className="invalid">{errors.twins.message}</span>}
                                </React.Fragment>
                            )
                            } />
                    </div>
                </Col>
                {twinsSelected?.value === 1 && (
                    <React.Fragment>
                        <Col lg={6}>
                            <span className="form-note">Siapakah Nama Kembaran Anda?</span>
                        </Col>
                        <Col lg={6}>
                            <div className="form-group">
                                <div className="form-control-wrap">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="twinsName"
                                        placeholder="Ex. Muhammad Arif Muntaha"
                                        {...register("twinsName", { required: true })}
                                    />
                                    {errors.twinsName && <span className="invalid">Kolom tidak boleh kosong</span>}
                                </div>
                            </div>
                        </Col>
                    </React.Fragment>
                )}
                <Col lg={8}>
                    <span className="form-note">Apakah anda alumni dari {institutionBefore?.surname}?</span>
                </Col>
                <Col lg={4}>
                    <div className="form-control-wrap">
                        <Controller
                            control={control}
                            name="graduate"
                            rules={{ required: "Kolom tidak boleh kosong" }}
                            render={({ field: { value, onChange } }) => (
                                <React.Fragment>
                                    <RSelect
                                        options={statusOptions}
                                        value={value}
                                        onChange={(selectedOption) => onChange(selectedOption)}
                                        placeholder="Pilih Status"
                                    />
                                    <input type="hidden" id="graduate" className="form-control" />
                                    {errors.graduate && <span className="invalid">{errors.graduate.message}</span>}
                                </React.Fragment>
                            )
                            } />
                    </div>
                </Col>
                <Col lg={8}>
                    <span className="form-note">Apakah anda berdomisili di Menganti?</span>
                </Col>
                <Col lg={4}>
                    <div className="form-control-wrap">
                        <Controller
                            control={control}
                            name="domicile"
                            rules={{ required: "Kolom tidak boleh kosong" }}
                            render={({ field: { value, onChange } }) => (
                                <React.Fragment>
                                    <RSelect
                                        options={statusOptions}
                                        value={value}
                                        onChange={(selectedOption) => onChange(selectedOption)}
                                        placeholder="Pilih Status"
                                    />
                                    <input type="hidden" id="domicile" className="form-control" />
                                    {errors.domicile && <span className="invalid">{errors.domicile.message}</span>}
                                </React.Fragment>
                            )
                            } />
                    </div>
                </Col>
                <Col lg={8}>
                    <span className="form-note">Apakah anda Santri Dari Ponpes Darul Hikmah Menganti?</span>
                </Col>
                <Col lg={4}>
                    <div className="form-control-wrap">
                        <Controller
                            control={control}
                            name="student"
                            rules={{ required: "Kolom tidak boleh kosong" }}
                            render={({ field: { value, onChange } }) => (
                                <React.Fragment>
                                    <RSelect
                                        options={statusOptions}
                                        value={value}
                                        onChange={(selectedOption) => onChange(selectedOption)}
                                        placeholder="Pilih Status"
                                    />
                                    <input type="hidden" id="student" className="form-control" />
                                    {errors.student && <span className="invalid">{errors.student.message}</span>}
                                </React.Fragment>
                            )
                            } />
                    </div>
                </Col>
                <Col lg={8}>
                    <span className="form-note">Apakah anda putra/putri dari Guru/Karyawan Yayasan Darul Hikmah Menganti?</span>
                </Col>
                <Col lg={4}>
                    <div className="form-control-wrap">
                        <Controller
                            control={control}
                            name="teacherSon"
                            rules={{ required: "Kolom tidak boleh kosong" }}
                            render={({ field: { value, onChange } }) => (
                                <React.Fragment>
                                    <RSelect
                                        options={statusOptions}
                                        value={value}
                                        onChange={(selectedOption) => onChange(selectedOption)}
                                        placeholder="Pilih Status"
                                    />
                                    <input type="hidden" id="teacherSon" className="form-control" />
                                    {errors.teacherSon && <span className="invalid">{errors.teacherSon.message}</span>}
                                </React.Fragment>
                            )
                            } />
                    </div>
                </Col>
                <Col lg={8}>
                    <span className="form-note">Apakah anda mempunyai saudara yang mondok di PONPES Darul Hikmah?</span>
                </Col>
                <Col lg={4}>
                    <div className="form-control-wrap">
                        <Controller
                            control={control}
                            name="sibling"
                            rules={{ required: "Kolom tidak boleh kosong" }}
                            render={({ field }) => (
                                <React.Fragment>
                                    <RSelect
                                        options={statusOptions}
                                        value={field.value}
                                        onChange={(selectedOption) => field.onChange(selectedOption)}
                                        placeholder="Pilih Status"
                                    />
                                    <input type="hidden" id="sibling" className="form-control" />
                                    {errors.sibling && <span className="invalid">Kolom tidak boleh kosong.</span>}
                                </React.Fragment>
                            )
                            } />
                    </div>
                </Col>
                {siblingSelected?.value === 1 && (
                    <React.Fragment>
                        <Col lg={6}>
                            <span className="form-note">Jenjang apakah saudara kandung anda?</span>
                        </Col>
                        <Col lg={6}>
                            <div className="form-control-wrap">
                                <Controller
                                    control={control}
                                    name="siblingInstitution"
                                    rules={siblingRules}
                                    render={({ field: { value, onChange } }) => (
                                        <React.Fragment>
                                            <RSelect
                                                options={institutionOptions}
                                                value={institutionOptions?.find((item) => item.value === (value as any)) || value}
                                                onChange={(val) => onChange(val)}
                                                placeholder="Pilih Lembaga"
                                            />
                                            <input type="hidden" id="sibling" className="form-control" />
                                            {errors.siblingInstitution && <span className="invalid">{errors.siblingInstitution.message}</span>}
                                        </React.Fragment>
                                    )
                                    } />
                            </div>
                        </Col>
                        <Col lg={6}>
                            <span className="form-note">Siapakah nama saudara kandung anda?</span>
                        </Col>
                        <Col lg={6}>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="siblingName"
                                    placeholder="Ex. Muhammad Arif Muntaha"
                                    {...register("siblingName", siblingRules)}
                                />
                                {errors.siblingName && <span className="invalid">{errors.siblingName.message}</span>}
                            </div>
                        </Col>
                    </React.Fragment>
                )}
            </Row>
        </div>
    )
}

export default StudentVerificationForm;