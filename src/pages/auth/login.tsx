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
import { Form, Spinner } from "reactstrap";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import type { LoginFormType } from "@/types";
import { login as loginUser } from "@/common/api/auth";
import { useAuthContext } from "@/common/hooks/useAuthContext";
import { Navigate } from "react-router";

const Login = () => {
    const { isLogged, setUser, setIsLogged } = useAuthContext()
    const [loading, setLoading] = useState(false);
    const [passState, setPassState] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (value: LoginFormType) => {
        setLoading(true);
        await loginUser(value).then((resp) => {
            if (resp !== undefined) {
                if (resp.user?.phone_verified_at === null) {
                    navigate("/auth/verifikasi");
                    setUser(resp.user);
                    localStorage.setItem('tempUser', JSON.stringify(resp.user))
                } else {
                    setUser(resp.user);
                    setIsLogged(true);
                    navigate('/dashboard');
                }
            } else {
                return;
            }
        }).finally(() => setLoading(false));
    };

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormType>();

    return (
        <React.Fragment>
            {isLogged && <Navigate to="/dashboard" />}
            <Head title="Masuk" />
            <Block className="nk-block-middle nk-auth-body  wide-xs">
                <div className="brand-logo pb-4 text-center">
                    <Link to={"/"} className="logo-link">
                        <img className="logo-light logo-img logo-img-lg" src={Logo} alt="logo" />
                        <img className="logo-dark logo-img logo-img-lg" src={LogoDark} alt="logo-dark" />
                    </Link>
                </div>

                <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
                    <BlockHead>
                        <BlockContent>
                            <BlockTitle tag="h4">Masuk</BlockTitle>
                            <BlockDes>
                                <p>Akses Sistem PMB menggunakan email dan kata sandi Anda.</p>
                            </BlockDes>
                        </BlockContent>
                    </BlockHead>
                    <Form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <div className="form-label-group">
                                <label className="form-label" htmlFor="email">
                                    Alamat Email
                                </label>
                            </div>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    id="email"
                                    {...register('email', { required: "Kolom ini wajib diisi" })}
                                    placeholder="Masukkan alamat email Anda"
                                    className="form-control-lg form-control" />
                                {errors.email && <span className="invalid">{errors.email.message}</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="form-label-group">
                                <label className="form-label" htmlFor="password">
                                    Kata Sandi
                                </label>
                                <Link className="link link-primary link-sm" to={`/auth/lupa-sandi`}>
                                    Lupa Sandi?
                                </Link>
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
                                    {...register('password', { required: "Kolom ini wajib diisi" })}
                                    placeholder="Masukkan kata sandi Anda"
                                    className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`} />
                                {errors.password && <span className="invalid">{errors.password.message}</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <Button size="lg" className="btn-block" type="submit" color="primary">
                                {loading ? <Spinner size="sm" color="light" /> : "Masuk"}
                            </Button>
                        </div>
                    </Form>
                    <div className="form-note-s2 text-center pt-4">
                        Belum punya akun? <Link to={`/auth/buat-akun`}>Buat akun</Link>
                    </div>
                </PreviewCard>
            </Block>
            <AuthFooter />
        </React.Fragment>
    );
};
export default Login;
