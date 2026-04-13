import {CardImg, Modal, ModalBody, ModalHeader} from "reactstrap";
import {Button, Col, Icon, Row} from "@/components";
import {useEffect, useState} from "react";
import type {WhatsappType} from "@/types";
import { login as loginWhatsapp } from "@/common/api/whatsapp";

interface LoginProps {
    modal: { partial: boolean, login: boolean };
    setModal: (modal: { partial: boolean, login: boolean }) => void;
    whatsapp: WhatsappType
    setWhatsapp: (whatsapp: WhatsappType) => void
}
const Login = ({modal, setModal, whatsapp, setWhatsapp} : LoginProps) => {
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [qrCode, setQrCode] = useState<string>();
    const handleQRCode = () => {
        if (whatsapp.device !== "") {
            loginWhatsapp({device: whatsapp.device}).then((resp) => {
                setQrCode(resp.qr_link)
                setTimeLeft(30)
            });
        }
    }
    const toggle = () => {
        setModal({
            partial: false,
            login: false
        });
        setWhatsapp({
            id: undefined,
            institutionId: undefined,
            device: '',
            active: 0
        })
    };
    useEffect(() => {
        handleQRCode();
    }, [whatsapp])

    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
        }, 1000);

        if (timeLeft === 0) {
            handleQRCode();
        }
        return () => clearInterval(timer);
    }, [timeLeft]);

    return (
        <Modal isOpen={modal.login} toggle={toggle} size="lg">
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross" />
                </button>
            }>Login Whatsapp
            </ModalHeader>
            <ModalBody>
                <Row className="gy-0">
                    <Col size={4}>
                        <CardImg src={qrCode} alt="qrcode" />
                    </Col>
                    <Col size={8} className="align-content-center">
                        <div className="mt-2 mb-2"><h4>Please scan to connect</h4></div>
                        <div className="mt-2"><p>Open Setting | Linked Devices | Link Device</p></div>

                        <div className="mb-2"><p>QR Code expires in {timeLeft} seconds (auto-refreshing)</p></div>
                        <Button color="primary" className="align-end">Refresh QRCode</Button>
                    </Col>
                </Row>
            </ModalBody>
        </Modal>
    )
}

export default Login;