import React, { type ReactNode } from 'react';
import classNames from "classnames";

interface AppRootProps {
    className?: string;
    children?: ReactNode;
}

const AppRoot: React.FC<AppRootProps> = ({ className, children, ...props }) => {
    const compClass = classNames({
        "nk-app-root": true,
        [`${className}`]: className,
    });

    return (
        <div className={compClass} {...props}>
            {children}
        </div>
    );
}

export default AppRoot;
