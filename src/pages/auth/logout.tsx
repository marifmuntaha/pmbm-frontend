import React, {useEffect, useState} from "react";
import Logo from "@/images/logo.png";
import LogoDark from "@/images/logo-dark.png";
import Head from "@/layout/head";
import AuthFooter from "@/layout/footer";
import {Block, BlockContent, BlockDes, BlockHead, BlockTitle, Button, Loading} from "@/components";
import { Link } from "react-router-dom";
import {useAuthContext} from "@/common/hooks/useAuthContext";
import {logout} from "@/common/api/auth";
import {apiCore} from "@/common/api/core";

const Logout = () => {
    const api = new apiCore()
    const {isLogged, setIsLogged, setUser} = useAuthContext()
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const handleLogout = async () => {
            try {
                await logout().then(() => {
                    setIsLogged(false)
                    setUser(undefined)
                    api.setLoggedInUser(undefined)
                })
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        if (isLogged) handleLogout()
    }, []);

    if (loading) return <Loading />

    return (
        <React.Fragment>
            <Head title="Keluar" />
            <Block className="nk-block-middle nk-auth-body">
                <div className="brand-logo pb-5">
                    <Link to={`/`} className="logo-link">
                        <img className="logo-light logo-img logo-img-lg" src={Logo} alt="logo" />
                        <img className="logo-dark logo-img logo-img-lg" src={LogoDark} alt="logo-dark" />
                    </Link>
                </div>
                <BlockHead>
                    <BlockContent>
                        <BlockTitle tag="h4">Berhasil Keluar</BlockTitle>
                        <BlockDes className="text-success">
                            <p>Anda dapat menutup peramban dengan aman.</p>
                            <Link to={`/auth/masuk`}>
                                <Button color="primary" size="lg">
                                    Kembali MASUK
                                </Button>
                            </Link>
                        </BlockDes>
                    </BlockContent>
                </BlockHead>
            </Block>
            <AuthFooter />
        </React.Fragment>
    );
};
export default Logout;
