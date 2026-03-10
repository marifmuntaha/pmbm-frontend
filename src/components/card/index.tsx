import React, { type ReactNode } from "react";
import { Card } from "reactstrap";

import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import "highlight.js/styles/a11y-light.css";

hljs.registerLanguage('javascript', javascript);

interface PreviewCardProps {
    className?: string;
    bodyClass?: string;
    children: ReactNode;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({ className, bodyClass, ...props }) => {
    return (
        <Card className={`card-preview ${className ? className : ""}`}>
            <div className={`card-inner ${bodyClass ? bodyClass : ""}`}>{props.children}</div>
        </Card>
    );
};

export const PreviewAltCard: React.FC<PreviewCardProps> = ({ className, bodyClass, ...props }) => {
    return (
        <Card className={`${className ? className : ""}`}>
            <div className={`card-inner ${bodyClass ? bodyClass : ""}`}>{props.children}</div>
        </Card>
    );
};
