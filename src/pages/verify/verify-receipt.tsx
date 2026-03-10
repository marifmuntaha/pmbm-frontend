import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Head from "@/layout/head";
import { Block, Icon } from "@/components";
import { Card, Badge, Spinner } from "reactstrap";
import { verifyReceipt } from "@/common/api/payment/receipt";
import { formatCurrency } from "@/helpers";
import moment from "moment/moment";
import "moment/locale/id";

type ReceiptDataType = {
    valid: boolean;
    receipt_number: string;
    payment: {
        amount: number;
        transaction_id: string;
        transaction_time: string;
        method: string;
    };
    student: {
        name: string;
    };
    institution: {
        name: string;
        logo: string;
    };
    invoice: {
        reference: string;
    };
    generated_at: string;
};

const VerifyReceipt = () => {
    const { token } = useParams<{ token: string }>();
    const [loading, setLoading] = useState(true);
    const [receipt, setReceipt] = useState<ReceiptDataType | null>(null);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (token) {
            verifyReceipt(token)
                .then((resp) => {
                    if (resp.status === "success" && resp.result) {
                        setReceipt(resp.result);
                    } else {
                        setError(resp.statusMessage || "Bukti pembayaran tidak valid");
                    }
                })
                .catch(() => {
                    setError("Terjadi kesalahan saat memverifikasi bukti pembayaran");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [token]);

    return (
        <React.Fragment>
            <Head title="Verifikasi Bukti Pembayaran" />
            <div className="nk-content">
                <div className="container-fluid">
                    <div className="nk-content-inner">
                        <div className="nk-content-body">
                            <Block className="mt-5">
                                <div className="row justify-content-center">
                                    <div className="col-lg-8 col-xl-6">
                                        {loading ? (
                                            <Card className="card-bordered text-center p-5">
                                                <Spinner color="primary" />
                                                <p className="mt-3">Memverifikasi bukti pembayaran...</p>
                                            </Card>
                                        ) : error ? (
                                            <Card className="card-bordered text-center p-5">
                                                <div className="mb-4">
                                                    <Icon
                                                        name="cross-circle"
                                                        className="text-danger"
                                                        style={{ fontSize: "64px" }}
                                                    />
                                                </div>
                                                <h4 className="text-danger">Verifikasi Gagal</h4>
                                                <p className="text-soft">{error}</p>
                                            </Card>
                                        ) : receipt && receipt.valid ? (
                                            <Card className="card-bordered">
                                                <div className="card-inner">
                                                    <div className="text-center mb-4">
                                                        <div className="mb-3">
                                                            <Icon
                                                                name="check-circle"
                                                                className="text-success"
                                                                style={{ fontSize: "64px" }}
                                                            />
                                                        </div>
                                                        <h4 className="text-success">
                                                            <Icon name="shield-check" /> Bukti Pembayaran Valid
                                                        </h4>
                                                        <Badge color="success" className="mt-2" pill>
                                                            Terverifikasi
                                                        </Badge>
                                                    </div>

                                                    <hr />

                                                    <div className="text-center mb-4">
                                                        <img
                                                            src={receipt.institution.logo}
                                                            alt={receipt.institution.name}
                                                            style={{ maxHeight: "80px", marginBottom: "10px" }}
                                                        />
                                                        <h5>{receipt.institution.name}</h5>
                                                    </div>

                                                    <div className="row gy-3">
                                                        <div className="col-12">
                                                            <div className="form-group">
                                                                <label className="form-label text-soft">
                                                                    Nomor Bukti Pembayaran
                                                                </label>
                                                                <div className="form-control-wrap">
                                                                    <h6 className="mb-0">{receipt.receipt_number}</h6>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-12">
                                                            <div className="form-group">
                                                                <label className="form-label text-soft">
                                                                    Nama Pendaftar
                                                                </label>
                                                                <div className="form-control-wrap">
                                                                    <h6 className="mb-0">{receipt.student.name}</h6>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label className="form-label text-soft">
                                                                    Nomor Invoice
                                                                </label>
                                                                <div className="form-control-wrap">
                                                                    <p className="mb-0">{receipt.invoice.reference}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label className="form-label text-soft">
                                                                    Metode Pembayaran
                                                                </label>
                                                                <div className="form-control-wrap">
                                                                    <p className="mb-0">{receipt.payment.method}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label className="form-label text-soft">
                                                                    ID Transaksi
                                                                </label>
                                                                <div className="form-control-wrap">
                                                                    <p className="mb-0 small">
                                                                        {receipt.payment.transaction_id}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label className="form-label text-soft">
                                                                    Tanggal Pembayaran
                                                                </label>
                                                                <div className="form-control-wrap">
                                                                    <p className="mb-0">
                                                                        {moment(receipt.payment.transaction_time).locale('id').format(
                                                                            "DD MMMM YYYY, HH:mm"
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-12">
                                                            <div className="form-group">
                                                                <label className="form-label text-soft">
                                                                    Total Pembayaran
                                                                </label>
                                                                <div className="form-control-wrap">
                                                                    <h4 className="text-success mb-0">
                                                                        {formatCurrency(receipt.payment.amount)}
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-12">
                                                            <div className="alert alert-info">
                                                                <Icon name="info-fill" /> Bukti pembayaran ini di-generate
                                                                pada{" "}
                                                                {moment(receipt.generated_at).locale('id').format(
                                                                    "DD MMMM YYYY, HH:mm:ss"
                                                                )}{" "}
                                                                WIB
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        ) : null}
                                    </div>
                                </div>
                            </Block>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default VerifyReceipt;
