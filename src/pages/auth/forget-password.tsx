import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/images/logo2x.png";
import LogoDark from "@/images/logo-dark2x.png";
import Head from "@/layout/head";
import AuthFooter from "@/layout/footer/auth";
import { Block, BlockContent, BlockDes, BlockHead, BlockTitle, Button, PreviewCard } from "@/components";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

interface ForgetPasswordFormType {
    email: string;
}

const ForgotPassword = () => {
    const navigate = useNavigate();

    const onSubmit = (data: ForgetPasswordFormType) => {
        console.log(data);
        navigate('/auth-success');
    };

    const { register, handleSubmit, formState: {errors} } = useForm<ForgetPasswordFormType>();

    return (
        <React.Fragment>
            <Head title="Forgot-Password" />
            <Block className="nk-block-middle nk-auth-body wide-xs">
                <div className="brand-logo pb-4 text-center">
                    <Link to={"/"} className="logo-link">
                        <img className="logo-light logo-img logo-img-lg" src={Logo} alt="logo" />
                        <img className="logo-dark logo-img logo-img-lg" src={LogoDark} alt="logo-dark" />
                    </Link>
                </div>
                <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
                    <BlockHead>
                        <BlockContent>
                            <BlockTitle tag="h5">Atur ulang kata sandi</BlockTitle>
                            <BlockDes>
                                <p>Jika Anda lupa kata sandi, kami akan mengirimkan pesan berisi petunjuk untuk mengantur ulang kata sandi Anda.</p>
                            </BlockDes>
                        </BlockContent>
                    </BlockHead>
                    <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <div className="form-label-group">
                                <label className="form-label" htmlFor="email">
                                    Alamat Email
                                </label>
                            </div>
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                id="email"
                                placeholder="Masukkan alamat email Anda"
                                {...register("email", { required: "Email tidak boleh kosong." })}
                            />
                            {errors.email && <p className="invalid">{errors.email.message}</p>}
                        </div>
                        <div className="form-group">
                            <Button color="primary" size="lg" className="btn-block">
                                Kirim Tautan Reset
                            </Button>
                        </div>
                    </form>
                    <div className="form-note-s2 text-center pt-4">
                        <Link to={`/auth/masuk`}>
                            <strong>Kembali untuk masuk</strong>
                        </Link>
                    </div>
                </PreviewCard>
            </Block>
            <AuthFooter />
        </React.Fragment>
    );
};

export default ForgotPassword;
