import React from "react";
import {Icon} from "../../components";

interface ToggleProps {
    className?: string;
    click: (event: React.MouseEvent<HTMLAnchorElement>) => void;
    icon: string;
}

const Toggle: React.FC<ToggleProps> = ({ className, click, icon }) => {
    return (
        <a
            href={"#"}
            className={className || ""}
            onClick={(ev) => {
                ev.preventDefault();
                click(ev);
            }}
        >
            <Icon name={icon} />
        </a>
    );
};

export default Toggle;
