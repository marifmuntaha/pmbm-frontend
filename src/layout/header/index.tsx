import React from "react";
import classNames from "classnames";
import Toggle from "../sidebar/toggle";
import Logo from "../logo";
import User from "./user";
// import Notification from "./dropdown/notification/Notification";

import { useTheme, useThemeUpdate } from '@/common/hooks/useTheme';
import { useAuthContext } from "@/common/hooks/useAuthContext";
import { Button } from "@/components";
import { Link } from "react-router-dom";

// Define types for the Header component props
interface HeaderProps {
    fixed?: boolean;  // fixed is optional, boolean value
    className?: string;  // className is optional, string value
}

const Header: React.FC<HeaderProps> = ({ fixed, className }) => {
    const { isLogged } = useAuthContext();
    const theme = useTheme();  // Theme from context
    const themeUpdate = useThemeUpdate();  // Theme update function from context

    // Construct class names dynamically based on theme and props
    const headerClass = classNames({
        "nk-header": true,
        "nk-header-fixed": fixed,
        [`is-light`]: theme.header === "white",
        [`is-${theme.header}`]: theme.header !== "white" && theme.header !== "light",
        [`${className}`]: className,
    });

    return (
        <div className={headerClass}>
            <div className="container-fluid">
                <div className="nk-header-wrap">
                    <div className="nk-menu-trigger d-xl-none ms-n1">
                        <Toggle
                            className="nk-nav-toggle nk-quick-nav-icon d-xl-none ms-n1"
                            icon="menu"
                            click={themeUpdate.sidebarVisibility}  // Use context function for sidebar visibility
                        />
                    </div>
                    <div className="nk-header-brand d-xl-none">
                        <Logo />
                    </div>
                    {/*<div className="nk-header-search ms-3 ms-xl-0">*/}
                    {/*    <HeaderSearch />*/}
                    {/*</div>*/}
                    <div className="nk-header-tools">
                        <ul className="nk-quick-nav">
                            {/*<li className="chats-dropdown hide-mb-xs">*/}
                            {/*    <ChatDropdown />*/}
                            {/*</li>*/}
                            {/*<li className="notification-dropdown me-n1">*/}
                            {/*    <Notification />*/}
                            {/*</li>*/}
                            <li className="user-dropdown">
                                {isLogged ? (
                                    <User />
                                ) : (
                                    <Link to="/auth/masuk">
                                        <Button className="bg-blue text-white">MASUK</Button>
                                    </Link>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
