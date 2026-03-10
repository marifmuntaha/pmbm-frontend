import React from "react";
import { Outlet } from "react-router-dom";
import Head from "@/layout/head";

export const NoSidebar = ({title} : {title?: string}) => {
    return (
        <React.Fragment>
            <Head title={title || 'Loading'} />
            <div className="nk-app-root">
                <div className="nk-wrap nk-wrap-nosidebar">
                    <div className="nk-content">
                        <Outlet />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};