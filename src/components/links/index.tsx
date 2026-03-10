import React, { type ReactNode } from "react";
import { Link } from "react-router-dom";
import {Icon} from "../icon";
import classNames from "classnames";

interface LinkItemProps {
    tag?: "a" | "link";
    link: string;
    icon?: string;
    text?: string;
    children?: ReactNode;
    className?: string;
    onClick?: () => void;
}

export const LinkItem: React.FC<LinkItemProps> = ({ tag = "link", ...props }) => {
    return (
        <li>
            {tag !== "a" ? (
                <Link to={props.link} {...props}>
                    {props.icon ? <Icon name={props.icon} /> : null} <span>{props.text || props.children}</span>
                </Link>
            ) : (
                <a href={props.link} onClick={(ev) => ev.preventDefault()}>
                    {props.icon ? <Icon name={props.icon} /> : null} <span>{props.text || props.children}</span>
                </a>
            )}
        </li>
    );
};

interface LinkListProps {
    opt?: boolean;
    className?: string;
    children: ReactNode;
}

export const LinkList: React.FC<LinkListProps> = ({ ...props }) => {
    const listClasses = classNames({
        "link-list": !props.opt,
        "link-list-opt": props.opt,
        [`${props.className}`]: props.className,
    });
    return <ul className={listClasses}>{props.children}</ul>;
};
