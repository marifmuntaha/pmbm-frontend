import React, { useEffect, useState } from "react";
import { Controller, type UseFormReturn, useWatch } from "react-hook-form";
import { Icon, Row, RSelect } from "@/components";
import { ROLE_OPTIONS } from "@/common/constants";
import type { OptionsType, UserType } from "@/types";
import { useAuthContext } from "@/common/hooks/useAuthContext";
import { get as getInstitution } from "@/common/api/institution";

interface UserFormProps {
    methods: UseFormReturn<UserType>
}
const UserForm = ({ methods }: UserFormProps) => {
    const { user } = useAuthContext()
    const { control, register, formState: { errors } } = methods;
    const [passState, setPassState] = useState(false);
    const [confmState, setConfmState] = useState(false);
    const [institutionOptions, setInstitutionOptions] = useState<OptionsType[]>()
    const id = useWatch({ control, name: 'id' })
    const ruleRole = user?.role === 4 ? "Lembaga tidak boleh kosong." : false

    useEffect(() => {
        getInstitution<OptionsType>({ type: 'select' }).then((resp) => {
            if (resp.length > 0) {
                setInstitutionOptions(resp);
            }
        })
    }, []);

    return (
        <React.Fragment>
            <Row className="gy-0 mb-3">
                {user?.role === 1 && (
                    <div className="form-group">
                        <label className="form-label" htmlFor="institutionId">Lembaga</label>
                        <div className="form-control-wrap">
                            <Controller
                                control={control}
                                name="institutionId"
                                rules={{ required: ruleRole }}
                                render={({ field: { value, onChange } }) => (
                                    <React.Fragment>
                                        <RSelect
                                            options={institutionOptions}
                                            value={institutionOptions?.find((item) => item.value === value)}
                                            onChange={(val) => onChange(val?.value)}
                                            placeholder="Pilih Lembaga"
                                        />
                                        <input type="hidden" id="institutionId" className="form-control" />
                                        {errors.institutionId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                                    </React.Fragment>
                                )
                                } />
                        </div>
                    </div>
                )}
                <div className="form-group">
                    <label className="form-label" htmlFor="name">Nama Pengguna</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder="Ex. Muhammad Arif Muntaha"
                            {...register("name", { required: true })}
                        />
                        {errors.name && <span className="invalid">Kolom tidak boleh kosong</span>}
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="email">Alamat Email</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            id="email"
                            placeholder="Ex. marifmuntaha@gmail.com"
                            {...register("email", { required: true })}
                        />
                        {errors.email && <span className="invalid">Kolom tidak boleh kosong</span>}
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="password">Kata Sandi</label>
                    <div className="form-control-wrap">
                        <a
                            href={"#password"}
                            onClick={(ev) => {
                                ev.preventDefault();
                                setPassState(!passState);
                            }}
                            className={`form-icon form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                        >
                            <Icon name="eye" className="passcode-icon icon-show"></Icon>
                            <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                        </a>
                        <input
                            type={passState ? "text" : "password"}
                            className={`form-control ${passState ? "is-hidden" : "is-shown"}`}
                            id="password"
                            placeholder="Ex. *************"
                            {...register("password", { required: id === undefined })}
                        />
                        {errors.password && <span className="invalid">Kolom tidak boleh kosong</span>}
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="password_confirmation">Ulangi Sandi</label>
                    <div className="form-control-wrap">
                        <a
                            href={"#password"}
                            onClick={(ev) => {
                                ev.preventDefault();
                                setConfmState(!confmState);
                            }}
                            className={`form-icon form-icon-right passcode-switch ${confmState ? "is-hidden" : "is-shown"}`}
                        >
                            <Icon name="eye" className="passcode-icon icon-show"></Icon>
                            <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                        </a>
                        <input
                            type={confmState ? "text" : "password"}
                            className={`form-control ${confmState ? "is-hidden" : "is-shown"}`}
                            id="password_confirmation"
                            placeholder="Ex. *************"
                            {...register("password_confirmation", { required: id === undefined })}
                        />
                        {errors.password_confirmation && <span className="invalid">Kolom tidak boleh kosong</span>}
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="phone">No. Telepon</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            id="phone"
                            placeholder="082229366506"
                            {...register("phone", { required: true })}
                        />
                        {errors.password && <span className="invalid">Kolom tidak boleh kosong</span>}
                    </div>
                </div>
                {user?.role === 1 && (
                    <div className="form-group col-md-6">
                        <label className="form-label" htmlFor="role">Hak Akses</label>
                        <div className="form-control-wrap">
                            <Controller
                                control={control}
                                name="role"
                                rules={{ required: "Pilih Hak Akses" }}
                                render={({ field: { value, onChange } }) => (
                                    <React.Fragment>
                                        <RSelect
                                            options={ROLE_OPTIONS}
                                            value={ROLE_OPTIONS.find((item) => item.value === value)}
                                            onChange={(val) => onChange(val?.value)}
                                            placeholder="Pilih Hak Akses"
                                        />
                                        <input type="hidden" id="role" className="form-control" />
                                        {errors.role && <span className="invalid">Kolom tidak boleh kosong.</span>}
                                    </React.Fragment>
                                )
                                } />
                        </div>
                    </div>
                )}
            </Row>
        </React.Fragment>
    )
}

export default UserForm;