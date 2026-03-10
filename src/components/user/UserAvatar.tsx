import React, {type ReactNode} from "react";
import classNames from "classnames";
import {Icon} from "../icon";

interface UserAvatarProps {
    className?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    theme?: 'blue-dim' | 'blue' | 'azure-dim' | 'azure' | 'indigo-dim' | 'indigo' | 'purple-dim' | 'purple' | 'pink-dim' | 'pink' | 'orange-dim' | 'orange' | 'teal-dim' | 'teal' | 'primary-dim' | 'primary' | 'secondary-dim' | 'secondary' | 'success-dim' | 'success' | 'info-dim' | 'info' | 'warning-dim' | 'warning' | 'danger-dim' | 'danger' | 'dark-dim' | 'dark' | 'gray-dim' | 'gray' | 'lighter' | 'light';
    icon?: string;
    text?: string;
    image?: string;
    imageAlt?: string;
    children?: ReactNode;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
                                                   className,
                                                   size,
                                                   theme,
                                                   icon,
                                                   text,
                                                   image,
                                                   imageAlt,
                                                   ...props
                                               }) => {
    const classes = classNames({
        "user-avatar": true,
        [`${className}`]: className,
        [`user-avatar-${size}`]: size,
        [`bg-${theme}`]: theme,
    });

    return (
        <div className={classes} {...props}>
            {icon && <Icon name={icon}/>}
            {image && <img src={image} alt={imageAlt}/>}
            {text && !image && <span>{text}</span>}
            {props.children}
        </div>
    );
};