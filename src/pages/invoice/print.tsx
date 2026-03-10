import { useState, useEffect } from "react";
import { Button, Icon, Block } from "@/components";
import Content from "@/layout/content";
import Head from "@/layout/head";
import { useParams } from "react-router-dom";
import type {InvoiceDetailType, InvoicePrintType} from "@/types";
import {formatCurrency, getStatusInvoice} from "@/helpers";
import {show as showInvoice} from "@/common/api/invoice";

const InvoicePrint = () => {
    const [data, setData] = useState<InvoicePrintType>();
    const {id} = useParams();

    useEffect(() => {
        showInvoice({id: id, type: 'detail'}).then((resp) => {
            console.log(resp);
            const result = resp as unknown as InvoicePrintType;
            setData(result)
        })
    }, []);

    useEffect(() => {
        setTimeout(() => window.print(), 500);
    }, [data]);

    return (
        <body className="bg-white">
        <Head title="Invoice Print"></Head>
        {data && (
            <Content>
                <Block>
                    <div className="invoice invoice-print">
                        <div className="invoice-action">
                            <Button
                                size="lg"
                                color="primary"
                                outline
                                className="btn-icon btn-white btn-dim"
                                onClick={() => window.print()}
                            >
                                <Icon name="printer-fill"></Icon>
                            </Button>
                        </div>
                        <div className="invoice-wrap">
                            <div className="invoice-brand text-center">
                                <img src={data?.institutionLogo} alt="" />
                            </div>

                            <div className="invoice-head">
                                <div className="invoice-contact">
                                    <span className="overline-title">Tagihan Ke</span>
                                    <div className="invoice-contact-info">
                                        <h4 className="title">{data?.studentName}</h4>
                                        <ul className="list-plain">
                                            <li>
                                                <Icon name="map-pin-fill"></Icon>
                                                <span>{data?.studentAddress}</span>
                                            </li>
                                            <li>
                                                <Icon name="call-fill"></Icon>
                                                <span>{data?.userPhone}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="invoice-desc">
                                    <h3 className={`title ${getStatusInvoice(data.invoiceStatus)}`}>{data.invoiceStatus}</h3>
                                    <ul className="list-plain">
                                        <li className="invoice-id">
                                            <span>Nomor Tagihan</span>:<span>{data?.invoiceReference}</span>
                                        </li>
                                        <li className="invoice-date">
                                            <span>Jatuh Tempo</span>:<span>{data?.invoiceDueDate}</span>
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
                        </div>
                    </div>
                </Block>
            </Content>
        )}
        </body>
    );
};

export default InvoicePrint;
