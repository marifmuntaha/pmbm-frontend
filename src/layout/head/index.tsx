import { Helmet } from "react-helmet";

const Head = ({ title } : {title?: string}) => {
    return (
        <Helmet>
            <title>{title ? title + " | " : null}Sistem PMB Yayasan Darul Hikmah Menganti</title>
        </Helmet>
    );
};

export default Head;
