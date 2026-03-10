import React, { useEffect, useState } from "react";
import Head from "@/layout/head";
import Content from "@/layout/content";
import { Block, Icon } from "@/components";
import { Badge, Button, Card } from "reactstrap";
import { Link } from "react-router-dom";
import Verification from "@/pages/register/partials/verification";
import { get as getVerification } from "@/common/api/student/verivication";
import { useAuthContext } from "@/common/hooks/useAuthContext";
import { get as getInvoice } from "@/common/api/invoice";
import type { InvoiceType } from "@/types";
import { formatCurrency, getStatusInvoice } from "@/helpers";
import { store as storePayment } from "@/common/api/payment";
import { downloadAllReceipts } from "@/common/api/payment/receipt";
import type { PaymentModalType } from "@/types/model/payment";

declare global {
    interface Window {
        snap: any;
    }
}

const Student = () => {
    const { user } = useAuthContext()
    const [modal, setModal] = useState<PaymentModalType>({
        verification: false,
        create: false,
    })
    const [invoices, setInvoices] = useState<InvoiceType[]>()
    const [loadData, setLoadData] = useState(true)
    const handlePayment = (invoice: InvoiceType) => {
        storePayment({ reference: invoice.reference, amount: invoice.amount, userId: invoice.userId }).then((resp) => {
            if (resp.status === 'success') {
                const snapToken = resp.result?.snap_token;

                if (snapToken) {
                    // Use Midtrans Snap popup
                    if (window.snap) {
                        window.snap.pay(snapToken, {
                            onSuccess: function (result: any) {
                                console.log('success', result);
                                setLoadData(true);
                            },
                            onPending: function (result: any) {
                                console.log('pending', result);
                                setLoadData(true);
                            },
                            onError: function (result: any) {
                                console.log('error', result);
                            },
                            onClose: function () {
                                console.log('customer closed the popup without finishing the payment');
                            }
                        });
                    } else {
                        console.error('Midtrans Snap not loaded');
                    }
                }
            }
        })
    }

    const handleDownloadReceipt = async () => {
        try {
            const blob = await downloadAllReceipts(window.location.origin);

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `semua-kuitansi-pembayaran.pdf`;
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading receipt:', error);
        }
    };
    useEffect(() => {
        if (loadData) {
            getInvoice<InvoiceType>({ userId: user?.id }).then((resp) => {
                setInvoices(resp);
                setLoadData(false);
            })
        }
    }, [loadData]);

    // Load Midtrans Snap script dynamically
    useEffect(() => {
        // Check if script already exists
        const existingScript = document.querySelector('script[src*="snap.midtrans.com"]');
        if (existingScript) return;

        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', 'SB-Mid-client-XXXXXXXXXXXX');
        script.async = true;

        script.onload = () => {
            console.log('Midtrans Snap script loaded successfully');
        };

        script.onerror = () => {
            console.error('Failed to load Midtrans Snap script');
        };

        document.body.appendChild(script);

        // Cleanup function to remove script when component unmounts
        return () => {
            const scriptToRemove = document.querySelector('script[src*="snap.midtrans.com"]');
            if (scriptToRemove) {
                document.body.removeChild(scriptToRemove);
            }
        };
    }, []);

    useEffect(() => {
        getVerification({ userId: user?.id }).then((resp) => {
            if (resp.length === 0) {
                setModal({ ...modal, verification: true })
            }
        })
    }, []);
    return (
        <React.Fragment>
            <Head title="Tagihan"></Head>
            <Content>
                <Block>
                    <Card className="card-stretch">
                        <div className="card-inner-group">
                            <div className="card-inner">
                                <div className="card-title-group">
                                    <div className="card-title">
                                        <h5 className="title">Semua Tagihan</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-inner p-0">
                            <table className="table table-orders">
                                <thead className="tb-odr-head">
                                    <tr className="tb-odr-item">
                                        <th className="tb-odr-info">
                                            <span className="tb-odr-id">Nomor</span>
                                            <span className="tb-odr-date d-none d-md-inline-block">Keterangan</span>
                                        </th>
                                        <th className="tb-odr-amount">
                                            <span className="tb-odr-total">Jumlah</span>
                                            <span className="tb-odr-status d-none d-md-inline-block">Status</span>
                                        </th>
                                        <th className="tb-odr-action">&nbsp;</th>
                                    </tr>
                                </thead>
                                <tbody className="tb-odr-body">
                                    {invoices
                                        ? invoices?.map((invoice) => {
                                            return (
                                                <tr className="tb-odr-item" key={invoice.id}>
                                                    <td className="tb-odr-info">
                                                        <span className="tb-odr-id">
                                                            <Link to={`/data-tagihan/${invoice.id}/lihat`}>
                                                                {invoice.reference}
                                                            </Link>
                                                        </span>
                                                        <span className="tb-odr-date">Tagihan PMB Yayasan Darul Hikmah Menganti</span>
                                                    </td>
                                                    <td className="tb-odr-amount">
                                                        <span className="tb-odr-total">
                                                            <span className="amount">{formatCurrency(invoice.amount)}</span>
                                                        </span>
                                                        <span className="tb-odr-status">
                                                            <Badge
                                                                color={getStatusInvoice(invoice.status)}
                                                                className="badge-dot"
                                                            >
                                                                {invoice.status}
                                                            </Badge>
                                                        </span>
                                                    </td>
                                                    <td className="tb-odr-action">
                                                        <div className="tb-odr-btns d-none d-sm-inline">
                                                            {invoice.status !== 'PAID' && (
                                                                <Button color="success" className="btn btn-dim me-1" onClick={() => handlePayment(invoice)}>
                                                                    <Icon name="cc" /> <span>Bayar</span>
                                                                </Button>
                                                            )}
                                                            {invoice.status === 'PAID' && (
                                                                <Button color="success" className="btn btn-dim me-1" onClick={() => handleDownloadReceipt()} title="Download Bukti Pembayaran">
                                                                    <Icon name="download" /> <span>Unduh</span>
                                                                </Button>
                                                            )}
                                                            <Link to={`/pembayaran/${invoice.id}/lihat`}>
                                                                <Button color="primary" className="btn btn-dim">
                                                                    <Icon name="eye" /> <span>Lihat</span>
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                        {invoice.status !== 'PAID' && (
                                                            <Button color="success" className="btn-pd-auto d-sm-none" onClick={() => handlePayment(invoice)}>
                                                                <Icon name="cc" />
                                                            </Button>
                                                        )}
                                                        {invoice.status === 'PAID' && (
                                                            <Button color="success" className="btn-pd-auto d-sm-none" onClick={() => handleDownloadReceipt()} title="Download Bukti Pembayaran">
                                                                <Icon name="download" />
                                                            </Button>
                                                        )}

                                                    </td>
                                                </tr>
                                            )
                                        }) : null}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </Block>
            </Content>
            <Verification modal={modal} setModal={setModal} />
        </React.Fragment>
    )
}

export default Student