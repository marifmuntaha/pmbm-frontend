import React, { useEffect, useState } from "react";
import Head from "@/layout/head";
import Logo from "@/images/logo.png";
import LogoDark from "@/images/logo-dark.png";
import AuthFooter from "@/layout/footer/auth";
import { useAuthContext } from "@/common/hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Block, BlockContent, BlockDes, BlockHead, BlockTitle, Button, PreviewCard, Row } from "@/components";
import { Form, Spinner } from "reactstrap";
import { useForm } from "react-hook-form";
import { getVerifyPhone, storeVerifyPhone } from "@/common/api/auth";

interface verificationInterface {
    email: string;
    otp: string;
}

const PhoneVerification = () => {
    const { user, setUser, setIsLogged } = useAuthContext()
    const { handleSubmit, register, formState: { errors }, setValue } = useForm<verificationInterface>();
    const [loading, setLoading] = useState(false);
    const [resend, setResend] = useState(60)
    const navigate = useNavigate();

    const onSubmit = (formData: verificationInterface) => {
        setLoading(true);
        storeVerifyPhone(formData).then((resp) => {
            if (resp) {
                setUser(resp.user);
                setIsLogged(true);
                localStorage.removeItem('tempUser')
                navigate('/dashboard')
            }
        }).finally(() => setLoading(false));
    }

    const onResend = () => {
        setResend(60)
        const user = JSON.parse(localStorage.getItem('tempUser') || '{}')
        getVerifyPhone({ email: user?.email })
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('tempUser') || '{}')
        setValue('email', user?.email ? user.email : '')
    }, []);

    useEffect(() => {
        setTimeout(() => {
            if (resend !== 0) setResend(resend - 1)
        }, 1000)
    }, [resend]);

    return (
        <React.Fragment>
            <Head title="Verifikasi Nomor Whatsapp" />
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
                            <BlockTitle tag="h4">Verifikasi Nomor Whatsapp</BlockTitle>
                            <BlockDes>
                                <p>Kami telah mengirimkan kode verifikasi ke nomor {user?.phone}</p>
                            </BlockDes>
                        </BlockContent>
                    </BlockHead>
                    <Form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                        <Row className="gy-0">
                            <div className="form-group">
                                <div className="form-label-group">
                                    <label className="form-label" htmlFor="otp">
                                        Kode OTP
                                    </label>
                                </div>
                                <div className="form-control-wrap">
                                    <input
                                        type="text"
                                        id="otp"
                                        {...register('otp', { required: "Kolom OTP wajib diisi" })}
                                        placeholder="Masukkan alamat otp Anda"
                                        className="form-control-lg form-control" />
                                    {errors.otp && <span className="invalid">{errors.otp.message}</span>}
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <Button size="lg" className="btn-block" type="submit" color="primary">
                                    {loading ? <Spinner size="sm" color="light" /> : "VERIFIKASI"}
                                </Button>
                            </div>
                            <div className="form-group col-md-6">
                                <Button
                                    type="reset"
                                    size="lg"
                                    className="btn-block"
                                    color="info"
                                    onClick={() => onResend()}
                                    disabled={resend !== 0}
                                >
                                    {resend !== 0 ? resend + ' Detik' : "KIRIM KODE"}
                                </Button>
                            </div>
                        </Row>
                    </Form>
                </PreviewCard>
            </Block>
            <AuthFooter />
        </React.Fragment>
    )
}

export default PhoneVerification;