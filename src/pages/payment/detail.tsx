import React, { useEffect, useState } from "react";
import Head from "@/layout/head";
import Content from "@/layout/content";
import { Block, BlockBetween, BlockDes, BlockHead, BlockHeadContent, BlockTitle, Icon } from "@/components";
import moment from "moment/moment";
import { Link, useParams } from "react-router-dom";
import { Button } from "reactstrap";
import { formatIDR, getStatusInvoice } from "@/helpers";
import { show as showInvoice } from "@/common/api/invoice";
import type { InvoiceDetailType, InvoicePrintType } from "@/types";

const Detail = () => {
    const { id } = useParams();
    const [invoice, setInvoice] = useState<InvoicePrintType>()

    useEffect(() => {
        showInvoice<InvoicePrintType>({ id: id, type: 'detail' }).then((resp) => setInvoice(resp))
    }, [id])

    return (
        <React.Fragment>
            <Head title="Detail Tagihan" />
            {invoice && (
                <Content>
                    <BlockHead>
                        <BlockBetween className="g-3">
                            <BlockHeadContent>
                                <BlockTitle>
                                    Tagihan <strong className="text-primary small">{invoice.invoiceReference}</strong>
                                </BlockTitle>
                                <BlockDes className="text-soft">
                                    <ul className="list-inline">
                                        <li>
                                            Dibuat Tanggal: <span className="text-base">{moment(invoice.invoiceCreated).format('D MMM YYYY')}</span>
                                        </li>
                                    </ul>
                                </BlockDes>
                            </BlockHeadContent>
                            <BlockHeadContent>
                                <Link to={`/pembayaran`}>
                                    <Button color="light" outline className="bg-white d-none d-sm-inline-flex">
                                        <Icon name="arrow-left"></Icon>
                                        <span>Kembali</span>
                                    </Button>
                                </Link>
                                <Link to={`/invoice-list`}>
                                    <Button color="light" outline className="btn-icon bg-white d-inline-flex d-sm-none">
                                        <Icon name="arrow-left"></Icon>
                                    </Button>
                                </Link>
                            </BlockHeadContent>
                        </BlockBetween>
                    </BlockHead>
                    <Block>
                        <div className="invoice">
                            <div className="invoice-wrap">
                                <div className="invoice-brand text-center">
                                    <img src={invoice.institutionLogo} alt="" />
                                </div>
                                <div className="invoice-head">
                                    <div className="invoice-contact">
                                        <span className="overline-title">Ditagihkan Ke</span>
                                        <div className="invoice-contact-info">
                                            <h4 className="title">{invoice.studentName}</h4>
                                            <ul className="list-plain">
                                                <li>
                                                    <Icon name="map-pin-fill"></Icon>
                                                    <span>{invoice.studentAddress}</span>
                                                </li>
                                                <li>
                                                    <Icon name="call-fill"></Icon>
                                                    <span>{invoice.userPhone}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="invoice-desc">
                                        <h3 className={`title text-${getStatusInvoice(invoice.invoiceStatus)}`}>{invoice.invoiceStatus}</h3>
                                        <ul className="list-plain">
                                            <li className="invoice-id">
                                                <span>Nomor Tagihan</span>:<span>{invoice.invoiceReference}</span>
                                            </li>
                                            <li className="invoice-date">
                                                <span>Tanggal</span>:<span>{moment(invoice.invoiceDueDate).format('D MMM YYYY')}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="invoice-bills">
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th className="w-150px">Item ID</th>
                                                    <th className="w-55">Diskripsi</th>
                                                    <th className="text-end">Harga</th>
                                                    <th className="text-end">Potongan</th>
                                                    <th className="text-end">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {invoice.invoiceDetails.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td>{item.id}</td>
                                                        <td>{item.name} </td>
                                                        <td className="text-end">{formatIDR(item.price)}</td>
                                                        <td className="text-end">{formatIDR(item.discount)}</td>
                                                        <td className="text-end">{formatIDR(item.amount)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colSpan={2}></td>
                                                    <td colSpan={2}>Subtotal</td>
                                                    <td>{formatIDR(invoice.invoiceDetails.reduce((sum: number, invoice: InvoiceDetailType) => sum + invoice.amount, 0))}</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={2}></td>
                                                    <td colSpan={2}>Biaya Admin</td>
                                                    <td>{formatIDR(0)}</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={2}></td>
                                                    <td colSpan={2}>Total Tagihan</td>
                                                    <td>{formatIDR(invoice.invoiceDetails.reduce((sum: number, invoice: InvoiceDetailType) => sum + invoice.amount, 0))}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                        <div className="nk-notes ff-italic fs-12px text-soft">
                                            Faktur dibuat di komputer dan sah tanpa tanda tangan dan stempel.
                                        </div>
                                    </div>

                                    {/* Riwayat Pembayaran / Cicilan */}
                                    {invoice.invoicePayments && invoice.invoicePayments.filter(p => Number(p.status) === 2).length > 0 && (
                                        <div className="table-responsive mt-5">
                                            <h5 className="title mb-3">Riwayat Pembayaran / Cicilan</h5>
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th className="w-150px">ID Transaksi</th>
                                                        <th>Tanggal</th>
                                                        <th>Metode</th>
                                                        <th className="text-end">Nominal</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {invoice.invoicePayments.filter(p => Number(p.status) === 2).map((payment, idx) => (
                                                        <tr key={idx}>
                                                            <td>{payment.id}</td>
                                                            <td>{moment(payment.transaction_time || payment.created_at).format('D MMM YYYY, HH:mm')}</td>
                                                            <td>
                                                                {Number(payment.method) === 1 ? 'Tunai' : 'Online'}
                                                            </td>
                                                            <td className="text-end">{formatIDR(payment.amount)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <td colSpan={2}></td>
                                                        <td>Total Dibayarkan</td>
                                                        <td className="text-end fw-bold text-success">
                                                            {formatIDR(invoice.invoicePayments.filter(p => Number(p.status) === 2).reduce((sum, p) => sum + Number(p.amount), 0))}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={2}></td>
                                                        <td>Sisa Tagihan</td>
                                                        <td className="text-end fw-bold text-danger">
                                                            {formatIDR(
                                                                invoice.invoiceDetails.reduce((sum, item) => sum + Number(item.amount), 0) -
                                                                invoice.invoicePayments.filter(p => Number(p.status) === 2).reduce((sum, p) => sum + Number(p.amount), 0)
                                                            )}
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    </Block>
                </Content>
            )}
        </React.Fragment>
    )
}

export default Detail