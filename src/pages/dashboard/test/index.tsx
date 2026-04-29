import React, {useEffect, useState} from "react";
import {Card, CardBody, CardTitle, Row, Col, Spinner, Alert} from "reactstrap";
import Head from "@/layout/head";
import Content from "@/layout/content";
import {
    Button,
    Icon,
    PreviewCard,
    RSelect,
} from "@/components";
import { testWhatsAppMessage, testWhatsAppPdf, testPdfSignature } from "@/common/api/integrationTest";
import { store as storeTransaction } from "../../../common/api/payment/transaction"
import { get as getPayments } from "@/common/api/payment"
import { get as getAccount } from "@/common/api/institution/account"
import { get as getInstitution } from "@/common/api/institution"
import { get as getyear } from "@/common/api/master/year"
import type {InstitutionAccountType, OptionsType, PaymentType, TransactionType} from "@/types";

const IntegrationTest = () => {
    const [phone, setPhone] = useState<string>("");
    const [loadingMessage, setLoadingMessage] = useState<boolean>(false);
    const [loadingPdf, setLoadingPdf] = useState<boolean>(false);
    const [loadingSignature, setLoadingSignature] = useState<boolean>(false);
    const [result, setResult] = useState<{ type: string; status: string; message: string; data?: any } | null>(null);
    const [institutionOptions, setInstitutionOptions] = useState<OptionsType[]>([])
    const [institutionSelected, setInstitutionSelected] = useState<number>()
    const [yearOptions, setYearOptions] = useState<OptionsType[]>([])
    const [yearSelected, setYearSelected] = useState<number>()

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

    const handleSync = () => {
        getPayments<PaymentType>({ yearId: yearSelected, institutionId: institutionSelected, sort: 'asc' }).then((resp) => {
            resp.map((item) => {
                getAccount<InstitutionAccountType>({ institutionId: item.institutionId, method: item.method }).then((account) => {
                    const transactionData: TransactionType = {
                        yearId: yearSelected,
                        institutionId: institutionSelected,
                        accountId: account[0].id,
                        paymentId: item.id,
                        name: `Pembayaran ${item.method === 1 ? "Tunai" : "Online"} a.n ${item.personal.name} (${item.transaction_id})`,
                        credit: 0,
                        debit: item.amount,
                        created_at: item.created_at,
                        updated_at: item.updated_at
                    }
                    storeTransaction(transactionData, false);
                    if (item.method === 2) {
                        const costData: TransactionType = {
                            yearId: yearSelected,
                            institutionId: institutionSelected,
                            accountId: account[0].id,
                            paymentId: item.id,
                            name: `Biaya Transaksi via Midtrans (${item.transaction_id})`,
                            credit: 4500,
                            debit: 0
                        }
                        storeTransaction(costData, false);
                    }
                });
            })
        })
    }

    useEffect(() => {
        const fetchData = async () => {
            const institutions = await getInstitution<OptionsType>({type: 'select'});
            setInstitutionOptions(institutions);
            const years = await getyear<OptionsType>({type: 'select'});
            setYearOptions(years)
        }
        fetchData();
    }, []);

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
                    <Col md={6}>
                        <Card className="card-bordered">
                            <CardBody className="card-inner">
                                <CardTitle tag="h5">Layanan Transaksi</CardTitle>
                                <Row className="gy-4">
                                    <div className="form-group col-md-6">
                                        <label className="form-label">Pilih Tahun Ajaran</label>
                                        <div className="form-control-wrap">
                                            <RSelect
                                                options={yearOptions}
                                                value={yearOptions?.find((opt) => opt.value === yearSelected)}
                                                onChange={(opt) => setYearSelected(opt?.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label className="form-label">Pilih Lembaga</label>
                                        <div className="form-control-wrap">
                                            <RSelect
                                                options={institutionOptions}
                                                value={institutionOptions?.find((opt) => opt.value === institutionSelected)}
                                                onChange={(opt) => setInstitutionSelected(opt?.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <Button color="primary" outline onClick={handleSync} disabled={loadingSignature}>
                                            {loadingSignature ? <Spinner size="sm" /> : <Icon name="reload" />}
                                            <span className="ms-1">Sinkron Pembayaran Ke Arus Kas</span>
                                        </Button>
                                    </div>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="card-bordered">
                            <CardBody className="card-inner">
                                <CardTitle tag="h5">WhatsApp & PDF Service</CardTitle>
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
                                    <Button color="success" className="col-md-3 m-2" onClick={handleTestMessage} disabled={loadingMessage || loadingPdf}>
                                        {loadingMessage ? <Spinner size="sm" /> : <Icon name="send" />}
                                        <span className="ms-1">Kirim Pesan</span>
                                    </Button>
                                    <Button color="info" className="col-md-3 m-2" onClick={handleTestPdf} disabled={loadingMessage || loadingPdf}>
                                        {loadingPdf ? <Spinner size="sm" /> : <Icon name="file-pdf" />}
                                        <span className="ms-1">Kirim PDF</span>
                                    </Button>
                                    <Button color="primary" className="col-md-3 m-2" outline onClick={handleTestSignature} disabled={loadingSignature}>
                                        {loadingSignature ? <Spinner size="sm" /> : <Icon name="pen" />}
                                        <span className="ms-1">Sign PDF Test</span>
                                    </Button>
                                </div>
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
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </React.Fragment >
    );
};

export default IntegrationTest;
