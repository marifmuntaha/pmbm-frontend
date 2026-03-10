import classNames from "classnames";
import React from "react";

interface IconProps extends React.HTMLAttributes<HTMLElement> {
    name: string;
    id?: string;
    className?: string;
    style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({name, id, className, style, ...props}) => {
    const iconClass = classNames({
        [`${className}`]: className,
        'icon': true,
        'ni': true,
        [`ni-${name}`]: true,
    });

    return (
        <em
            className={iconClass}
            id={id}
            style={style}
            {...props}
        />
    );
};