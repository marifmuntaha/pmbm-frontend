import React from "react";
import { Outlet } from "react-router-dom";
import { menuDefault, menuAdmin, menuOperator, menuStudent, menuTreasurer, menuBoarding } from "./sidebar/MenuData";
import Sidebar from "./sidebar";
import Head from "./head";
import Header from "./header";
import Footer from "./footer";
import AppRoot from "./global/AppRoot";
import AppMain from "./global/AppMain";
import AppWrap from "./global/AppWrap";
import { useAuthContext } from "@/common/hooks/useAuthContext";

export const WithSidebar = ({ title }: { title?: string }) => {
    const { user } = useAuthContext()
    const mainMenu = () => {
        switch (user?.role) {
            case 1:
                return menuAdmin
            case 2:
                return menuOperator
            case 3:
                return menuTreasurer
            case 4:
                return menuStudent
            case 5:
                return menuBoarding
            default:
                return menuDefault
        }
    }
    return (
        <React.Fragment>
            <Head title={!title ? 'Loading' : title} />
            <AppRoot>
                <AppMain>
                    <Sidebar menuData={mainMenu()} fixed />
                    <AppWrap>
                        <Header fixed />
                        <Outlet />
                        <Footer />
                    </AppWrap>
                </AppMain>
            </AppRoot>
        </React.Fragment>
    );
};
