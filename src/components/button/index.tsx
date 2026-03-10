import React, { type ButtonHTMLAttributes, type ReactNode } from "react";
import classNames from "classnames";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    color?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark" | "blue";
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    className?: string;
    outline?: boolean;
    disabled?: boolean;
    children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ color, size, className, outline, disabled, ...props }) => {
    const buttonClass = classNames({
        btn: true,
        [`btn-${color}`]: !outline && color,
        [`btn-outline-${color}`]: outline && color,
        [`btn-${size}`]: size,
        disabled: disabled,
        [`${className}`]: className,
    });

    return (
        <button className={buttonClass} {...props}>
            {props.children}
        </button>
    );
};