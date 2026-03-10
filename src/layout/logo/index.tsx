import React from "react";
import { Link } from "react-router-dom";

import LogoLight from "@/images/logo.png";
import LogoDark from "@/images/logo-dark.png";
import LogoSmall from "@/images/logo-small.png";
import {useAuthContext} from "@/common/hooks/useAuthContext";

const Logo: React.FC = () => {
    const {isLogged} = useAuthContext()
    return (
        <Link to={isLogged ? '/dashboard' : '/'} className="logo-link">
            <img className="logo-light logo-img" src={LogoLight} alt="logo" />
            <img className="logo-dark logo-img" src={LogoDark} alt="logo" />
            <img className="logo-small logo-img logo-img-small" src={LogoSmall} alt="logo" />
        </Link>
    );
};

export default Logo;
