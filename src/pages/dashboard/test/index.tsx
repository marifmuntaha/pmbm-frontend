import React, { useState } from "react";
import { Card, CardBody, CardTitle, Row, Col, Spinner, Alert } from "reactstrap";
import Head from "@/layout/head";
import Content from "@/layout/content";
import {
    Button,
    Icon,
    PreviewCard,
    RSelect,
} from "@/components";
import { testWhatsAppMessage, testWhatsAppPdf, testMidtrans, testPdfSignature, testMidtransCallback } from "@/common/api/integrationTest";

const IntegrationTest = () => {
    const [phone, setPhone] = useState<string>("");
    const [orderId, setOrderId] = useState<string>("");
    const [callbackStatus, setCallbackStatus] = useState<string>("settlement");
    const [loadingMessage, setLoadingMessage] = useState<boolean>(false);
    const [loadingPdf, setLoadingPdf] = useState<boolean>(false);
    const [loadingSignature, setLoadingSignature] = useState<boolean>(false);
    const [loadingMidtrans, setLoadingMidtrans] = useState<boolean>(false);
    const [loadingCallback, setLoadingCallback] = useState<boolean>(false);
    const [result, setResult] = useState<{ type: string; status: string; message: string; data?: any } | null>(null);

    const statusOptions: any[] = [
        { value: "settlement", label: "Settlement (Lunas)" },
        { value: "pending", label: "Pending" },
        { value: "expire", label: "Expire" },
        { value: "cancel", label: "Cancel" },
    ];

    const handleTestMessage = async () => {
        if (!phone) {
            alert("Silakan masukkan nomor WhatsApp/HP");
            return;
        }
        setLoadingMessage(true);
        setResult(null);
        try {
            const resp = await testWhatsAppMessage(phone);
            setResult({
                type: "WhatsApp Message",
                status: resp.status,
                message: resp.statusMessage,
                data: resp.result
            });
        } catch (error: any) {
            setResult({
                type: "WhatsApp Message",
                status: "error",
                message: error.message || "Terjadi kesalahan sistem"
            });
        } finally {
            setLoadingMessage(false);
        }
    };

    const handleTestPdf = async () => {
        if (!phone) {
            alert("Silakan masukkan nomor WhatsApp/HP");
            return;
        }
        setLoadingPdf(true);
        setResult(null);
        try {
            const resp = await testWhatsAppPdf(phone);
            setResult({
                type: "WhatsApp PDF",
                status: resp.status,
                message: resp.statusMessage,
                data: resp.result
            });
        } catch (error: any) {
            setResult({
                type: "WhatsApp PDF",
                status: "error",
                message: error.message || "Terjadi kesalahan sistem"
            });
        } finally {
            setLoadingPdf(false);
        }
    };

    const handleTestSignature = async () => {
        setLoadingSignature(true);
        setResult(null);
        try {
            await testPdfSignature();
            // Handle blob/download if success, but for test we just check status
            setResult({
                type: "PDF Signature",
                status: "success",
                message: "PDF signed successfully. Check logs for details.",
            });
        } catch (error: any) {
            setResult({
                type: "PDF Signature",
                status: "error",
                message: error.message || "Terjadi kesalahan sistem"
            });
        } finally {
            setLoadingSignature(false);
        }
    };

    const handleTestMidtrans = async () => {
        setLoadingMidtrans(true);
        setResult(null);
        try {
            const resp = await testMidtrans();
            setResult({
                type: "Midtrans Payment",
                status: resp.status,
                message: resp.statusMessage,
                data: resp.result
            });
            if (resp.result?.order_id) {
                setOrderId(resp.result.order_id);
            }
        } catch (error: any) {
            setResult({
                type: "Midtrans Payment",
                status: "error",
                message: error.message || "Terjadi kesalahan sistem"
            });
        } finally {
            setLoadingMidtrans(false);
        }
    };

    const handleTestCallback = async () => {
        if (!orderId) {
            alert("Silakan masukkan Order ID dari test pembayaran");
            return;
        }
        setLoadingCallback(true);
        setResult(null);
        try {
            const resp = await testMidtransCallback({ order_id: orderId, status: callbackStatus });
            setResult({
                type: "Midtrans Callback",
                status: resp.status,
                message: resp.statusMessage,
                data: resp.result
            });
        } catch (error: any) {
            setResult({
                type: "Midtrans Callback",
                status: "error",
                message: error.message || "Terjadi kesalahan sistem"
            });
        } finally {
            setLoadingCallback(false);
        }
    };

    return (
        <React.Fragment>
            <Head title="Test Integrasi" />
            <Content>
                <Row className="gy-4">
                    <Col md={12}>
                        <PreviewCard className="bg-primary-dim border-primary">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <Icon name="live" className="text-primary fs-1 me-3" />
                                    <div>
                                        <h4 className="title text-primary mb-1">Layanan Integrasi</h4>
                                        <p className="text-soft">
                                            Tools untuk melakukan pengujian menyeluruh pada WhatsApp, PDF Signing, dan Midtrans Callback.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </PreviewCard>
                    </Col>

                    {result && (
                        <Alert color={result.status === "success" ? "success" : "secondary"} className="mb-4">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <strong>{result.type}:</strong> {result.message}
                                </div>
                                <Icon name={result.status === "success" ? "check-circle" : "alert-circle"} className={`fs-4 ${result.status === 'success' ? 'text-success' : 'text-danger'}`} />
                            </div>
                            {result.data && (
                                <div className="mt-2 text-wrap bg-white p-2 border rounded" style={{ fontSize: '11px', maxHeight: '200px', overflowY: 'auto' }}>
                                    <pre className="m-0 text-dark">{JSON.stringify(result.data, null, 2)}</pre>
                                </div>
                            )}
                        </Alert>
                    )}

                    <Row className="g-gs">
                        <Col md="6">
                            <Card className="card-bordered h-100">
                                <CardBody>
                                    <div className="card-title-group align-start mb-3">
                                        <CardTitle tag="h6" className="title">
                                            WhatsApp & PDF Service
                                        </CardTitle>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="phone">Nomor WhatsApp/HP</label>
                                        <div className="form-control-wrap">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="phone"
                                                placeholder="Contoh: 08123456789"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <Button color="success" onClick={handleTestMessage} disabled={loadingMessage || loadingPdf}>
                                            {loadingMessage ? <Spinner size="sm" /> : <Icon name="send" />}
                                            <span className="ms-1">Kirim Pesan</span>
                                        </Button>
                                        <Button color="info" onClick={handleTestPdf} disabled={loadingMessage || loadingPdf}>
                                            {loadingPdf ? <Spinner size="sm" /> : <Icon name="file-pdf" />}
                                            <span className="ms-1">Kirim PDF</span>
                                        </Button>
                                        <Button color="primary" outline onClick={handleTestSignature} disabled={loadingSignature}>
                                            {loadingSignature ? <Spinner size="sm" /> : <Icon name="pen" />}
                                            <span className="ms-1">Sign PDF Test</span>
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col md="6">
                            <Card className="card-bordered h-100">
                                <CardBody>
                                    <div className="card-title-group align-start mb-3">
                                        <CardTitle tag="h6" className="title">
                                            <Icon name="credit-card" className="me-2 text-primary" />
                                            Midtrans Full Flow
                                        </CardTitle>
                                    </div>

                                    <div className="bg-light p-3 rounded mb-3">
                                        <h6 className="overline-title mb-2">Langkah 1: Buat Transaksi</h6>
                                        <Button color="primary" onClick={handleTestMidtrans} disabled={loadingMidtrans} size="sm">
                                            {loadingMidtrans ? <Spinner size="sm" /> : <Icon name="plus" />}
                                            <span className="ms-1">Generate Order ID</span>
                                        </Button>
                                    </div>

                                    <div className="bg-lighter p-3 rounded">
                                        <h6 className="overline-title mb-2">Langkah 2: Simulasi Callback</h6>
                                        <div className="form-group">
                                            <label className="form-label overly-small" htmlFor="orderId">Order ID (Internal Reference)</label>
                                            <div className="form-control-wrap">
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    id="orderId"
                                                    placeholder="REF-XXXXX-TIME"
                                                    value={orderId}
                                                    onChange={(e) => setOrderId(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label overly-small" htmlFor="status">Status Pembayaran</label>
                                            <div className="form-control-wrap">
                                                <RSelect
                                                    options={statusOptions}
                                                    value={statusOptions.find((opt) => opt.value === callbackStatus)}
                                                    onChange={(opt: any) => setCallbackStatus(opt.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group mb-0">
                                            <Button color="warning" onClick={handleTestCallback} disabled={loadingCallback || !orderId} size="sm" className="w-100">
                                                {loadingCallback ? <Spinner size="sm" /> : <Icon name="flash" />}
                                                <span className="ms-1">Simulasi Webhook Callback</span>
                                            </Button>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Row>
            </Content>
        </React.Fragment >
    );
};

export default IntegrationTest;
