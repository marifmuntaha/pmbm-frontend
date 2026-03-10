import React, { type ReactNode } from "react";
import classnames from "classnames";

interface ColProps {
    sm?: number | boolean;
    lg?: number | boolean;
    md?: number | boolean;
    xl?: number | boolean;
    xxl?: number | boolean;
    size?: number | boolean;
    className?: string;
    children?: ReactNode;
}

interface RowProps {
    className?: string;
    children?: ReactNode;
}

export const Col: React.FC<ColProps> = ({ sm, lg, md, xl, xxl, size, className, ...props }) => {
    const classNames = classnames({
        [`col-sm-${sm}`]: sm,
        [`col-lg-${lg}`]: lg,
        [`col-md-${md}`]: md,
        [`col-xl-${md}`]: xl,
        [`col-xxl-${xxl}`]: xxl,
        [`col-${size}`]: size,
        [`${className}`]: className,
    });

    return <div className={classNames} {...props}>{props.children}</div>;
};

export const Row: React.FC<RowProps> = ({ className, ...props }) => {
    const rowClass = classnames({
        row: true,
        [`${className}`]: className,
    });

    return <div className={rowClass} {...props}>{props.children}</div>;
};
