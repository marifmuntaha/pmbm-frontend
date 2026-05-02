import React, {useEffect, useState} from "react";
import Head from "@/layout/head";
import {
    Block,
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Button,
    Icon,
    PreviewCard, ReactDataTable,
    Row
} from "@/components";
import Content from "@/layout/content";
import {useYearContext} from "@/common/hooks/useYearContext";
import {ButtonGroup, Card, Col} from "reactstrap";
import {get as getPayments} from "@/common/api/payment";
import type {ColumnType, PaymentType} from "@/types";
import {formatCurrency} from "@/helpers";
import {useAuthContext} from "@/common/hooks/useAuthContext";
import Partial from "./partials"

const Transaction = () => {
    const year = useYearContext();
    const {user} = useAuthContext();
    const [sm, updateSm] = useState(false);
    const [loadData, setLoadData] = useState(true);
    const [modal, setModal] = useState(false);
    const [payments, setPayments] = useState<PaymentType[]>([]);
    const [paymentsOwn, setPaymentsOwn] = useState<PaymentType[]>([]);
    const Column: ColumnType<PaymentType>[] = [
        {
            name: "Waktu",
            selector: (row) => row.transaction_time || row.created_at,
            sortable: true,
            width: "180px",
        },
        {
            name: "Lembaga",
            selector: (row) => row.institution?.name,
            sortable: false,
            width: "180px",
        },
        {
            name: "Siswa",
            selector: (row) => row.name,
            sortable: true,
            width: "350px",
        },
        {
            name: "Invoice",
            selector: (row) => row.reference || '-',
            sortable: false,
        },
        {
            name: "Metode",
            selector: (row) => row.method === 1 ? 'Cash' : 'Midtrans',
            sortable: false,
            width: "100px",
        },
        {
            name: "Jumlah",
            selector: (row) => formatCurrency(row.amount),
            sortable: false,
            right: "true"
        },
        {
            name: "Teller",
            selector: (row) => row.creator?.name,
            sortable: false,
            width: "200px",
        },

        {
            name: 'Aksi',
            selector: (row: any) => row.id,
            sortable: false,
            right: "true",
            cell: () => (
                <ButtonGroup size="sm">
                    <Button
                        outline
                        color="info"
                        onClick={() => alert('testing')}
                        title="Detail Pembayaran"
                    >
                        <Icon name="eye" />
                    </Button>
                    <Button
                        outline
                        color="success"
                        onClick={() => alert('testing')}
                        title="Kirim Notifikasi"
                    >
                        <Icon name="whatsapp" />
                    </Button>
                </ButtonGroup>
            )
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            if (loadData) {
                const payments = await getPayments<PaymentType>({type: 'datatable', yearId: year?.id, sort: 'desc'});
                const paymentsOwn = payments?.filter((item) => item.createdBy === user?.id);
                setPayments(payments);
                setPaymentsOwn(paymentsOwn);
            }
        }
        fetchData().finally(() => setLoadData(false));
    }, [loadData])
    return (
        <React.Fragment>
            <Head title="Data Transaksi" />
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Data Transaksi</BlockTitle>
                                <p>
                                    History Pembayaran Pendaftaran Penerimaan Murid Baru Tahun Ajaran {year?.name}
                                </p>
                            </BlockHeadContent>
                            <BlockHeadContent>
                                <div className="toggle-wrap nk-block-tools-toggle">
                                    <Button
                                        className={`btn-icon btn-trigger toggle-expand me-n1 ${sm ? "active" : ""}`}
                                        onClick={() => updateSm(!sm)}
                                    >
                                        <Icon name="menu-alt-r" />
                                    </Button>
                                    <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                                        <ul className="nk-block-tools g-3">
                                            <li>
                                                <Button outline color="info" size="sm" onClick={() => setModal(true)}>
                                                    <Icon name="plus" /> <span>TAMBAH</span>
                                                </Button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </BlockHeadContent>
                        </BlockBetween>
                    </BlockHead>
                    <Row className="gy-4">
                        <Col md={3}>
                            <Card className="card-bordered border-primary">
                                <div className="card-inner">
                                    <div className="card-title-group align-start mb-2">
                                        <div className="card-title">
                                            <h6 className="title text-soft">TOTAL TRANSAKSI</h6>
                                        </div>
                                        <div className="card-tools">
                                            <Icon name="coins" className="text-primary fs-4" />
                                        </div>
                                    </div>
                                    <div className="align-end flex-wrap g-3 justify-between">
                                        <div className="data">
                                            <div className="amount fw-bold">{payments?.length} Transaksi</div>
                                            <div className="info">Total Transaksi</div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="card-bordered border-primary">
                                <div className="card-inner">
                                    <div className="card-title-group align-start mb-2">
                                        <div className="card-title">
                                            <h6 className="title text-soft">JUMLAH TRANSAKSI</h6>
                                        </div>
                                        <div className="card-tools">
                                            <Icon name="coins" className="text-primary fs-4" />
                                        </div>
                                    </div>
                                    <div className="align-end flex-wrap g-3 justify-between">
                                        <div className="data">
                                            <div className="amount fw-bold">Rp. {formatCurrency(payments?.reduce((acc, item) => acc + item.amount, 0))}</div>
                                            <div className="info">Jumlah Transaksi</div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="card-bordered border-primary">
                                <div className="card-inner">
                                    <div className="card-title-group align-start mb-2">
                                        <div className="card-title">
                                            <h6 className="title text-soft">TOTAL TRANSAKSI SAYA</h6>
                                        </div>
                                        <div className="card-tools">
                                            <Icon name="coins" className="text-primary fs-4" />
                                        </div>
                                    </div>
                                    <div className="align-end flex-wrap g-3 justify-between">
                                        <div className="data">
                                            <div className="amount fw-bold">{paymentsOwn?.length} Transaksi</div>
                                            <div className="info">Total Transaksi</div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="card-bordered border-primary">
                                <div className="card-inner">
                                    <div className="card-title-group align-start mb-2">
                                        <div className="card-title">
                                            <h6 className="title text-soft">JUMLAH TRANSAKSI SAYA</h6>
                                        </div>
                                        <div className="card-tools">
                                            <Icon name="coins" className="text-primary fs-4" />
                                        </div>
                                    </div>
                                    <div className="align-end flex-wrap g-3 justify-between">
                                        <div className="data">
                                            <div className="amount fw-bold">Rp. {formatCurrency(paymentsOwn.reduce((acc, item) => acc + item.amount, 0))}</div>
                                            <div className="info">Jumlah Transaksi</div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col md={12}>
                            <PreviewCard>
                                <ReactDataTable
                                    data={payments}
                                    columns={Column}
                                    pagination
                                    progressPending={loadData}
                                />
                            </PreviewCard>
                        </Col>
                    </Row>
                </Block>
                <Partial modal={modal} setModal={setModal}/>
            </Content>
        </React.Fragment>
    )
}

export default Transaction