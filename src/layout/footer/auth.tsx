import { Link } from "react-router-dom";
import { Row, Col } from "@/components";

const AuthFooter = () => {
    return (
        <div className="nk-footer nk-auth-footer-full">
            <div className="container wide-lg">
                <Row className="g-3">
                    <Col lg={6} className="order-lg-last">
                        <ul className="nav nav-sm justify-content-center justify-content-lg-end">
                            <li className="nav-item">
                                <Link className="nav-link" target="_blank" to={`#`}>
                                    Syarat &amp; Kondisi
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" target="_blank" to={`#`}>
                                    Kebijakan Privasi
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" target="_blank" to={`#`}>
                                    Bantuan
                                </Link>
                            </li>
                        </ul>
                    </Col>
                    <Col lg={6}>
                        <div className="nk-block-content text-center text-lg-start">
                            <p className="text-soft">&copy; 2025 Sistem PMB Yayasan Darul Hikmah Menganti by kangKoding</p>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};
export default AuthFooter;