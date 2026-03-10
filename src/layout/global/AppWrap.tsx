import React, {type ReactNode} from 'react'
import classNames from "classnames"

interface AppWrapProps {
    className?: string
    children?: ReactNode
}

const AppWrap: React.FC<AppWrapProps> = ({className, children, ...props}) => {
    const compClass = classNames({
        "nk-wrap": true,
        [`${className}`]: className,
    });
    return (
        <div className={compClass} {...props}>
            {children}
        </div>
    )
}

export default AppWrap