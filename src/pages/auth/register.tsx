import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/images/logo.png";
import LogoDark from "@/images/logo-dark.png";
import Head from "@/layout/head";
import AuthFooter from "@/layout/footer/auth";
import {
    Block,
    BlockContent,
    BlockDes,
    BlockHead,
    BlockTitle,
    Button,
    Icon,
    PreviewCard,
} from "@/components";
import { Spinner } from "reactstrap";
import { useForm, useWatch } from "react-hook-form";
import { Link } from "react-router-dom";
import type { RegisterFormType } from "@/types";
import { register as registerUser } from "@/common/api/auth"
import { useAuthContext } from "@/common/hooks/useAuthContext";

const Register = () => {
    const { setUser } = useAuthContext();
    const [passState, setPassState] = useState(false);
    const [confmState, setConfmState] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, control } = useForm<RegisterFormType>();
    const navigate = useNavigate();
    const password = useWatch({ control, name: 'password' })
    const onSubmit = async (formData: RegisterFormType) => {
        setLoading(true);
        formData.role = 4
        await registerUser(formData).then((resp) => {
            if (resp !== undefined) {
                setUser(resp.user)
                localStorage.setItem('tempUser', JSON.stringify(resp.user))
                navigate('/auth/verifikasi')
            }
        }).finally(() => setLoading(false));
    };
    return (
        <React.Fragment>
            <Head title="Register" />
            <Block className="nk-block-middle nk-auth-body  wide-xs">
                <div className="brand-logo pb-4 text-center">
                    <Link to={`/`} className="logo-link">
                        <img className="logo-light logo-img logo-img-lg" src={Logo} alt="logo" />
                        <img className="logo-dark logo-img logo-img-lg" src={LogoDark} alt="logo-dark" />
                    </Link>
                </div>
                <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
                    <BlockHead>
                        <BlockContent>
                            <BlockTitle tag="h4">Buat Akun</BlockTitle>
                            <BlockDes>
                                <p>Buat Akun Sistem PMB Yayasan Darul Hikmah</p>
                            </BlockDes>
                        </BlockContent>
                    </BlockHead>
                    <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="name">Nama Lengkap</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    id="name"
                                    {...register('name', { required: 'Kolom ini wajib diisi' })}
                                    placeholder="Masukkan nama Anda"
                                    className="form-control-lg form-control" />
                                {errors.name && <p className="invalid">{errors.name.message}</p>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="phone">Nomor WA</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    id="phone"
                                    {...register('phone', { required: 'Kolom ini wajib diisi' })}
                                    placeholder="Masukkan nomor Whatsapp"
                                    className="form-control-lg form-control" />
                                {errors.phone && <p className="invalid">{errors.phone.message}</p>}
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="form-label-group">
                                <label className="form-label" htmlFor="email">Alamat Email</label>
                            </div>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    id="email"
                                    {...register('email', {
                                        required: 'Kolom ini wajib diisi',
                                        pattern: {
                                            value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                                            message: 'Alamat email tidak valid'
                                        }
                                    })}
                                    className="form-control-lg form-control"
                                    placeholder="Masukkan alamat email Anda" />
                                {errors.email && <p className="invalid">{errors.email.message}</p>}
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="form-label-group">
                                <label className="form-label" htmlFor="password">Kata Sandi</label>
                            </div>
                            <div className="form-control-wrap">
                                <a
                                    href={"#password"}
                                    onClick={(ev) => {
                                        ev.preventDefault();
                                        setPassState(!passState);
                                    }}
                                    className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                                >
                                    <Icon name="eye" className="passcode-icon icon-show"></Icon>

                                    <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                                </a>
                                <input
                                    type={passState ? "text" : "password"}
                                    id="password"
                                    {...register('password', {
                                        required: "Kolom ini wajib diisi",
                                        minLength: {
                                            value: 8,
                                            message: 'Kata sandi harus terdiri dari minimal 8 karakter'
                                        },
                                        pattern: {
                                            value: /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
                                            message: 'Kata sandi harus terdiri dari kombinasi huruf dan angka'
                                        }
                                    })}
                                    placeholder="Masukkan kata sandi Anda"
                                    className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`} />
                                {errors.password && <span className="invalid">{errors.password.message}</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="form-label-group">
                                <label className="form-label" htmlFor="password_confirmation">Kata Sandi</label>
                            </div>
                            <div className="form-control-wrap">
                                <a
                                    href={"#password"}
                                    onClick={(ev) => {
                                        ev.preventDefault();
                                        setConfmState(!confmState);
                                    }}
                                    className={`form-icon lg form-icon-right passcode-switch ${confmState ? "is-hidden" : "is-shown"}`}
                                >
                                    <Icon name="eye" className="passcode-icon icon-show"></Icon>

                                    <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                                </a>
                                <input
                                    type={confmState ? "text" : "password"}
                                    id="password_confirmation"
                                    {...register('password_confirmation', {
                                        required: "Kolom ini wajib diisi",
                                        validate: value => value === password || 'Kata sandi tidak cocok'
                                    })}
                                    placeholder="Masukkan kata sandi Anda"
                                    className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`} />
                                {errors.password_confirmation &&
                                    <span className="invalid">{errors.password_confirmation.message}</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <Button type="submit" color="primary" size="lg" className="btn-block">
                                {loading ? <Spinner size="sm" color="light" /> : "Buat Akun"}
                            </Button>
                        </div>
                    </form>
                    <div className="form-note-s2 text-center pt-4">
                        {" "}
                        Sudah punya akun?{" "}
                        <Link to={`/auth/masuk`}>
                            <strong>Masuk saja</strong>
                        </Link>
                    </div>
                </PreviewCard>
            </Block>
            <AuthFooter />
        </React.Fragment>
    )
};
export default Register;
