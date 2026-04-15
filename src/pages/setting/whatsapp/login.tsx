import {CardImg, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {Button, Col, Icon, Row} from "@/components";
import {useCallback, useEffect, useRef, useState} from "react";
import type {WhatsappType} from "@/types";
import { login as loginWhatsapp } from "@/common/api/whatsapp";

interface LoginProps {
    modal: { partial: boolean, login: boolean };
    setModal: (modal: { partial: boolean, login: boolean }) => void;
    whatsapp: WhatsappType
    setWhatsapp: (whatsapp: WhatsappType) => void
}

const WA_SERVICE_URL = import.meta.env.VITE_WHATSAPP_SERVICE_URL ?? 'https://gowa.own-server.web.id';

const toWsUrl = (httpUrl: string) =>
    httpUrl.replace(/^https:\/\//, 'wss://').replace(/^http:\/\//, 'ws://');

/**
 * Format pesan WebSocket dari go-whatsapp-web-multidevice:
 * { code: string, message: string, result: any }
 *
 * Event yang relevan untuk login:
 *   - "LOGIN_SUCCESS"  → QR berhasil di-scan, pasangan sukses
 *   - "LOGOUT_COMPLETE" / "DEVICE_REMOVED" → device logout
 */
interface WsMessage {
    code: string;
    message: string;
    result: unknown;
}

const Login = ({modal, setModal, whatsapp, setWhatsapp} : LoginProps) => {
    const [timeLeft, setTimeLeft]   = useState<number | null>(null);
    const [qrCode, setQrCode]       = useState<string | undefined>();
    const [loading, setLoading]     = useState(true);
    const [scanning, setScanning]   = useState(false); // QR berhasil di-scan, menunggu konfirmasi

    const wsRef        = useRef<WebSocket | null>(null);
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    /* ─── closeModal ─────────────────────────────────────────── */
    const closeModal = useCallback(() => {
        setModal({ partial: false, login: false });
        setWhatsapp({ id: undefined, institutionId: undefined, device: '', active: 0 });
    }, [setModal, setWhatsapp]);

    /* ─── tutup WebSocket ────────────────────────────────────── */
    const stopWs = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.onopen    = null;
            wsRef.current.onmessage = null;
            wsRef.current.onerror   = null;
            wsRef.current.onclose   = null;
            wsRef.current.close();
            wsRef.current = null;
        }
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    }, []);

    /* ─── fetch QR code ──────────────────────────────────────── */
    const fetchQr = useCallback(async () => {
        if (!whatsapp.device || !modal.login) return;
        setLoading(true);
        setScanning(false);
        try {
            const response = await loginWhatsapp({ device: whatsapp.device });
            if (response?.qr_link) {
                setQrCode(response.qr_link);
                setTimeLeft(30);
            }
        } catch (err) {
            console.error('[fetchQr]', err);
        } finally {
            setLoading(false);
        }
    }, [whatsapp.device, modal.login]);

    /* ─── WebSocket: aktif saat modal.login=true ─────────────── */
    useEffect(() => {
        if (!modal.login || !whatsapp.device) return;

        const wsUrl = `${toWsUrl(WA_SERVICE_URL)}/ws?device_id=${encodeURIComponent(whatsapp.device)}`;
        console.log('[WS] Membuka:', wsUrl);

        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => console.log('[WS] Terhubung');

        ws.onmessage = (event) => {
            try {
                const data: WsMessage = JSON.parse(event.data as string);
                console.log('[WS] Pesan:', data.code, data);

                switch (data.code) {
                    /**
                     * QR berhasil di-scan dan pair sukses.
                     * Tampilkan loading overlay lalu tutup modal.
                     */
                    case 'LOGIN_SUCCESS':
                        setScanning(true);  // Sembunyikan QR, tampilkan loading
                        closeTimerRef.current = setTimeout(() => {
                            stopWs();
                            closeModal();
                        }, 1500);           // Beri jeda 1.5 detik agar user melihat feedback
                        break;

                    case 'LOGOUT_COMPLETE':
                    case 'DEVICE_REMOVED':
                        // Device logout dari sisi lain — tutup modal
                        stopWs();
                        closeModal();
                        break;

                    default:
                        break;
                }
            } catch {
                /* bukan JSON, abaikan */
            }
        };

        ws.onerror = (e) => console.warn('[WS] Error:', e);

        ws.onclose = () => {
            console.log('[WS] Koneksi ditutup');
            wsRef.current = null;
        };

        /* cleanup: tutup WS ketika modal.login → false */
        return () => {
            console.log('[WS] Cleanup');
            stopWs();
        };
    }, [modal.login, whatsapp.device]); // eslint-disable-line react-hooks/exhaustive-deps

    /* ─── Fetch QR saat modal terbuka ───────────────────────── */
    useEffect(() => {
        if (modal.login && whatsapp.device) {
            fetchQr();
        }
    }, [modal.login, whatsapp.device]); // eslint-disable-line react-hooks/exhaustive-deps

    /* ─── Countdown timer ────────────────────────────────────── */
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;
        const t = setInterval(() =>
            setTimeLeft(prev => (prev !== null ? prev - 1 : null))
        , 1000);
        return () => clearInterval(t);
    }, [timeLeft]);

    /* ─── Auto-refresh QR saat timer habis ──────────────────── */
    useEffect(() => {
        if (modal.login && timeLeft === 0 && !loading && !scanning) {
            fetchQr();
        }
    }, [timeLeft]); // eslint-disable-line react-hooks/exhaustive-deps

    /* ─── Toggle modal ───────────────────────────────────────── */
    const toggle = () => {
        stopWs();
        closeModal();
    };

    /* ─── Render ─────────────────────────────────────────────── */
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
                    <Col size={4} className="border border-primary">
                        <div className="d-flex justify-content-center align-items-center"
                             style={{minHeight: 200, position: 'relative'}}>
                            {loading ? (
                                /* Sedang fetch QR dari backend */
                                <Spinner color="primary" size="lg" />
                            ) : scanning ? (
                                /* QR sudah di-scan → tampilkan loading overlay */
                                <div style={{position: 'relative', width: '100%', textAlign: 'center'}}>
                                    <CardImg
                                        src={qrCode}
                                        alt="qrcode"
                                        style={{opacity: 0.15, filter: 'blur(4px)'}}
                                    />
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', justifyContent: 'center',
                                        gap: 8
                                    }}>
                                        <Spinner color="success" size="lg" />
                                        <small className="text-success fw-semibold">Login berhasil!</small>
                                    </div>
                                </div>
                            ) : qrCode ? (
                                /* QR siap untuk di-scan */
                                <CardImg src={qrCode} alt="qrcode" />
                            ) : (
                                <Spinner color="primary" size="lg" />
                            )}
                        </div>
                    </Col>
                    <Col size={8} className="align-content-center">
                        <div className="mt-2 mb-2"><h4>Please scan to connect</h4></div>
                        <div className="mt-2"><p>Open Setting | Linked Devices | Link Device</p></div>
                        <div className="mb-2">
                            <p>
                                {scanning
                                    ? 'Login berhasil! Menutup...'
                                    : `QR Code expires in ${timeLeft} seconds (auto-refreshing)`
                                }
                            </p>
                        </div>
                        <Button
                            color="primary"
                            className="align-end"
                            disabled={loading || scanning}
                            onClick={fetchQr}
                        >
                            Refresh QRCode
                        </Button>
                    </Col>
                </Row>
            </ModalBody>
        </Modal>
    );
};

export default Login;