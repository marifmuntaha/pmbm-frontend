import React, {type JSX, type ReactNode} from "react";
import { Link } from "react-router-dom";
import {Icon} from "@/components";
import classNames from "classnames";

interface BlockProps {
    className?: string;
    size?: string;
    children: ReactNode;
}

interface BlockContentProps {
    className?: string;
    children: ReactNode;
}

interface BlockBetweenProps {
    className?: string;
    children: ReactNode;
}

interface BlockHeadProps {
    className?: string;
    size?: string;
    wide?: boolean;
    children: ReactNode;
}

interface BlockHeadContentProps {
    className?: string;
    children: ReactNode;
}

interface BlockTitleProps {
    className?: string;
    page?: boolean;
    tag?: keyof JSX.IntrinsicElements;
    children: ReactNode;
}

interface BlockDesProps {
    className?: string;
    page?: boolean;
    children: ReactNode;
}

interface BackToProps {
    className?: string;
    link: string;
    icon: string;
    children: ReactNode;
}

export const Block: React.FC<BlockProps> = ({ className, size, ...props }) => {
    const blockClass = classNames({
        "nk-block": true,
        [`nk-block-${size}`]: size,
        [`${className}`]: className,
    });
    return <div className={blockClass}>{props.children}</div>;
};

export const BlockContent: React.FC<BlockContentProps> = ({ className, ...props }) => {
    const blockContentClass = classNames({
        "nk-block-content": true,
        [`${className}`]: className,
    });
    return <div className={blockContentClass}>{props.children}</div>;
};

export const BlockBetween: React.FC<BlockBetweenProps> = ({ className, ...props }) => {
    return <div className={`nk-block-between ${className ? className : ""}`}>{props.children}</div>;
};

export const BlockHead: React.FC<BlockHeadProps> = ({ className, size, wide, ...props }) => {
    const blockHeadClass = classNames({
        "nk-block-head": true,
        [`nk-block-head-${size}`]: size,
        [`wide-${wide}`]: wide,
        [`${className}`]: className,
    });
    return <div className={blockHeadClass}>{props.children}</div>;
};

export const BlockHeadContent: React.FC<BlockHeadContentProps> = ({ className, ...props }) => {
    return <div className={`nk-block-head-content${className ? " " + className : ""}`}>{props.children}</div>;
};

export const BlockTitle: React.FC<BlockTitleProps> = ({ className, page, ...props }) => {
    const classes = `nk-block-title ${page ? "page-title" : "title"}${className ? " " + className : ""}`;
    return (
        <React.Fragment>
            {!props.tag ? (
                <h3 className={classes}>{props.children}</h3>
            ) : (
                <props.tag className={classes}>{props.children}</props.tag>
            )}
        </React.Fragment>
    );
};

export const BlockDes: React.FC<BlockDesProps> = ({ className, page, ...props }) => {
    const classes = `nk-block-des${className ? " " + className : ""}`;
    return <div className={classes}>{props.children}</div>;
};

export const BackTo: React.FC<BackToProps> = ({ className, link, icon, ...props }) => {
    const classes = `back-to${className ? " " + className : ""}`;
    return (
        <div className="nk-block-head-sub">
            <Link className={classes} to={link}>
                <Icon name={icon} />
                <span>{props.children}</span>
            </Link>
        </div>
    );
};
