import React, { type ReactNode } from 'react';
import classNames from "classnames";

// Define the props interface for the component
interface AppMainProps {
    className?: string;  // Optional custom className
    children?: ReactNode; // Optional children prop (can be any valid JSX content)
}

const AppMain: React.FC<AppMainProps> = ({ className, children, ...props }) => {
    const compClass = classNames({
        "nk-main": true,
        [`${className}`]: className,
    });

    return (
        <div className={compClass} {...props}>
            {children}
        </div>
    );
}

export default AppMain;
