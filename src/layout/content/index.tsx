import React, {type ReactNode} from "react";

interface ContentProps {
    page?: string;
    children: ReactNode;
}

const Content: React.FC<ContentProps> = ({page, children}) => {
    return (
        <div className="nk-content">
            <div className="container-fluid">
                <div className="nk-content-inner">
                    <div className="nk-content-body">
                        {!page ? children : null}
                        {page === "component" ? (
                            <div className="components-preview wide-md mx-auto">{children}</div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Content;
