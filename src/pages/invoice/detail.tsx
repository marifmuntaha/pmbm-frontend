import React, { useState, useEffect } from "react";
import {
    BlockHead,
    BlockTitle,
    Button,
    Icon,
    BlockDes,
    BlockHeadContent,
    Block,
    BlockBetween,
} from "@/components";
import Content from "@/layout/content";
import Head from "@/layout/head";
import { useParams, Link } from "react-router-dom";
import { show as showInvoice } from "@/common/api/invoice"
import type { InvoiceDetailType, InvoicePrintType } from "@/types";
import moment from "moment/moment";
import { formatCurrency, getStatusInvoice } from "@/helpers";

const InvoiceDetail = () => {
    const { id } = useParams();
    const [data, setData] = useState<InvoicePrintType>()
    useEffect(() => {
        showInvoice({ id: id, type: 'detail' }).then((resp) => {
            const result = resp as unknown as InvoicePrintType;
            setData(result)
        })
    }, []);
    return (
        <React.Fragment>
            <Head title="Detail Tagihan"></Head>
            {data && (
                <Content>
                    <BlockHead>
                        <BlockBetween className="g-3">
                            <BlockHeadContent>
                                <BlockTitle>
                                    Tagihan <strong className="text-primary small">#{data.invoiceReference}</strong>
                                </BlockTitle>
                                <BlockDes className="text-soft">
                                    <ul className="list-inline">
                                        <li>
                                            Tanggal: <span className="text-base">{moment(data.invoiceCreated).format('DD MMMM YYYY')}</span>
                                        </li>
                                    </ul>
                                </BlockDes>
                            </BlockHeadContent>
                            <BlockHeadContent>
                                <Link to={`/data-tagihan`}>
                                    <Button color="light" outline className="bg-white d-none d-sm-inline-flex">
                                        <Icon name="arrow-left"></Icon>
                                        <span>Kembali</span>
                                    </Button>
                                </Link>
                                <Link to={`/data-tagihan`}>
                                    <Button color="light" outline className="btn-icon bg-white d-inline-flex d-sm-none">
                                        <Icon name="arrow-left"></Icon>
                                    </Button>
                                </Link>
                            </BlockHeadContent>
                        </BlockBetween>
                    </BlockHead>

                    <Block>
                        <div className="invoice">
                            <div className="invoice-action">
                                <Link to={`/data-tagihan/${id}/cetak`} target="_blank">
                                    <Button size="lg" color="primary" outline className="btn-icon btn-white btn-dim">
                                        <Icon name="printer-fill"></Icon>
                                    </Button>
                                </Link>
                            </div>
                            <div className="invoice-wrap">
                                <div className="invoice-brand text-center">
                                    <img src={data.institutionLogo} alt="" />
                                </div>

                                <div className="invoice-head">
                                    <div className="invoice-contact">
                                        <span className="overline-title">Tagihan Ke</span>
                                        <div className="invoice-contact-info">
                                            <h4 className="title">{data.studentName}</h4>
                                            <ul className="list-plain">
                                                <li>
                                                    <Icon name="map-pin-fill"></Icon>
                                                    <span>{data.studentAddress}</span>
                                                </li>
                                                <li>
                                                    <Icon name="call-fill"></Icon>
                                                    <span>{data.userPhone}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="invoice-desc">
                                        <h3 className={`title text-${getStatusInvoice(data.invoiceStatus)}`}>{data.invoiceStatus}</h3>
                                        <ul className="list-plain">
                                            <li className="invoice-id">
                                                <span>Nomor</span>:<span>{data.invoiceReference}</span>
                                            </li>
                                            <li className="invoice-date">
                                                <span>Jatuh Tempo</span>:<span>{moment(data.invoiceDueDate).format('DD MMMM YYYY HH:mm')}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="invoice-bills">
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th className="w-150px">ID Item</th>
                                                    <th className="w-60">Diskripsi</th>
                                                    <th className="text-end">Harga</th>
                                                    <th className="text-end">Potongan</th>
                                                    <th className="text-end">Jumlah</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.invoiceDetails.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td>{item.id}</td>
                                                        <td>{item.name}</td>
                                                        <td className="text-end">{formatCurrency(item.price)}</td>
                                                        <td className="text-end">{formatCurrency(item.discount)}</td>
                                                        <td className="-text-end">{formatCurrency(item.amount)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colSpan={2}></td>
                                                    <td colSpan={2}>Total</td>
                                                    <td>{formatCurrency(data.invoiceDetails.reduce((sum: number, invoice: InvoiceDetailType) => sum + invoice.amount, 0))}</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={2}></td>
                                                    <td colSpan={2}>Biaya Admin</td>
                                                    <td>0</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={2}></td>
                                                    <td colSpan={2}>Total Tagihan</td>
                                                    <td>{formatCurrency(data.invoiceDetails.reduce((sum: number, invoice: InvoiceDetailType) => sum + invoice.amount, 0))}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                        <div className="nk-notes ff-italic fs-12px text-soft">
                                            Faktur dibuat di komputer dan sah tanpa tanda tangan dan stempel.
                                        </div>
                                    </div>
                                </div>

                                <div className="invoice-bills mt-5">
                                    <h5 className="title">History Pembayaran</h5>
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Tanggal</th>
                                                    <th>Metode</th>
                                                    <th className="text-end">Jumlah Bayar</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.invoicePayments.map((payment, idx) => (
                                                    <tr key={idx}>
                                                        <td>{moment(payment.transaction_time || payment.created_at).format('DD/MM/YYYY HH:mm')}</td>
                                                        <td>{payment.method === 1 ? 'Cash' : 'Midtrans'}</td>
                                                        <td className="text-end">{formatCurrency(payment.amount)}</td>
                                                    </tr>
                                                ))}
                                                {data.invoicePayments.length === 0 && (
                                                    <tr>
                                                        <td colSpan={3} className="text-center text-soft">Belum ada riwayat pembayaran</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colSpan={2} className="text-end"><strong>Total Terbayar</strong></td>
                                                    <td className="text-end"><strong>{formatCurrency(data.invoicePayments.reduce((sum, p) => sum + p.amount, 0))}</strong></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Block>
                </Content>
            )}
        </React.Fragment>
    );
};
export default InvoiceDetail;
