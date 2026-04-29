import React, { useCallback, useEffect, useState } from "react";
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
    RSelect
} from "@/components";
import Content from "@/layout/content";
import { get as getTransaction, dashboard as dashboardTransaction } from "../../common/api/payment/transaction"
import { get as getAccount } from "@/common/api/institution/account"
import type {ColumnType, OptionsType, TransactionDashboardType, TransactionType} from "@/types";
import { useYearContext } from "@/common/hooks/useYearContext";
import { useAuthContext } from "@/common/hooks/useAuthContext";
import { useInstitutionContext } from "@/common/hooks/useInstitutionContext";
import Partial from "@/pages/cashflow/partial"
import { printReceipt } from "@/pages/cashflow/printReceipt";
import {Card, Col, FormGroup, Label, Row} from "reactstrap";
import DatePicker from "react-datepicker";
import moment from "moment/moment";
import {formatCurrency} from "@/helpers";

const Cashflow = () => {
    const year = useYearContext();
    const { user } = useAuthContext();
    const institution = useInstitutionContext();
    const [sm, updateSm] = useState(false)
    const [modal, setModal] = useState(false)
    const [loadData, setLoadData] = useState(true)
    const [transactions, setTransactions] = useState<TransactionType[]>([])
    const [accountOptions, setAccountOptions] = useState<OptionsType[]>()
    const [accountSelected, setAccountSelected] = useState<number>()
    const [typeSelected, setTypeSelected] = useState<number>()
    const [startSelected, setStartSelected] = useState<Date | null>(null)
    const [endSelected, setEndSelected] = useState<Date | null>(null)
    const [dashboard, setDashboard] = useState<TransactionDashboardType>();
    const typeOptions: OptionsType[] = [
        { value: 0, label: "Semua Transaksi" },
        { value: 1, label: "Transaksi Masuk" },
        { value: 2, label: "Transaksi Keluar" }
    ]
    const params = useCallback(() => {
        const p: any = {
            type: 'datatable',
            yearId: year?.id,
            institutionId: user?.institutionId
        }
        if (accountSelected) p.account = accountSelected
        if (typeSelected) p.type = typeSelected
        if (startSelected) p.start = moment(startSelected).format("YYYY-MM-DD")
        if (endSelected) p.end = moment(endSelected).format("YYYY-MM-DD")
        return p;
    }, [year, accountSelected, typeSelected, user, startSelected, endSelected]);
    const Column: ColumnType<TransactionType>[] = [
        {
            name: "Tanggal",
            selector: (row) => moment(row?.created_at).format("DD MMMM YYYY HH:mm:ss"),
            sortable: false,
        },
        {
            name: "Rekening",
            selector: (row) => row.account?.name,
            sortable: false,
            width: "200px"
        },
        {
            name: "Keterangan",
            selector: (row) => row.name,
            sortable: false,
            width: "540px"
        },
        {
            name: "Kredit",
            selector: (row) => row.credit !== 0 ? formatCurrency(row.credit) : "",
            sortable: false,
            right: "true"

        },
        {
            name: "Debit",
            selector: (row) => row.debit !== 0 ? formatCurrency(row?.debit) : "",
            sortable: false,
            right: "true"
        },
        {
            name: "Saldo",
            selector: (row) => row.balance !== 0 ? formatCurrency(row?.balance) : "",
            sortable: false,
            right: "true",
        },
        {
            name: "",
            selector: (row) => row.id,
            sortable: false,
            right: "true",
            cell: (row) => {
                return row.debit === 0 && <Button color="info" outline size="xs" onClick={() => handlePrintRow(row)}>
                    <Icon name="printer"/>
                </Button>
            }
        },
    ]

    const handlePrintRow = (row: TransactionType) => {
        const isDebit = (row.debit ?? 0) > 0;
        printReceipt({
            name: row.name ?? '',
            amount: isDebit ? (row.debit ?? 0) : (row.credit ?? 0),
            type: isDebit ? 2 : 1,
            accountLabel: row.account?.name ?? '',
            treasurerName: user?.name ?? 'Bendahara',
            institutionName: institution?.surname ?? user?.institution?.name ?? '',
            recipientName: '',
            yearName: year?.name ?? '',
            logoUrl: institution?.logo ?? undefined,
        });
    };

    useEffect(() => {
        const fetchData = () => {
            getAccount<OptionsType>({ type: 'select', institutionId: user?.institutionId }).then((resp) => {
                setAccountOptions([{ value: 0, label: 'Semua Rekening' }, ...resp]);
            })
        }
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = () => {
            getTransaction<TransactionType>(params()).then((resp) => {
                setTransactions(resp)
            }).finally(() => setLoadData(false))
            dashboardTransaction<TransactionDashboardType>(params()).then((resp) => setDashboard(resp))
        }
        if (loadData) fetchData()
    }, [loadData, params])
    return (
        <React.Fragment>
            <Head title="Data Tagihan" />
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Arus Kas</BlockTitle>
                                <p>
                                    Data Arus Kas
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
                                                <Button
                                                    color="success"
                                                    size="sm"
                                                    onClick={() => setModal(true)}
                                                >
                                                    <Icon name="plus" />
                                                    <span>TAMBAH</span>
                                                </Button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </BlockHeadContent>
                        </BlockBetween>
                    </BlockHead>
                    <Row className="mb-4">
                        <Col md={2}>
                            <Card className="card-bordered border-primary">
                                <div className="card-inner">
                                    <div className="card-title-group align-start mb-2">
                                        <div className="card-title">
                                            <h6 className="title text-soft">TOTAL SALDO</h6>
                                        </div>
                                        <div className="card-tools">
                                            <Icon name="coins" className="text-primary fs-4" />
                                        </div>
                                    </div>
                                    <div className="align-end flex-wrap g-3 justify-between">
                                        <div className="data">
                                            <div className="amount fw-bold">Rp. {formatCurrency(dashboard?.balance)}</div>
                                            <div className="info">Total Saldo</div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col md={2}>
                            <Card className="card-bordered border-primary">
                                <div className="card-inner">
                                    <div className="card-title-group align-start mb-2">
                                        <div className="card-title">
                                            <h6 className="title text-soft">TUNAI</h6>
                                        </div>
                                        <div className="card-tools">
                                            <Icon name="coins" className="text-primary fs-4" />
                                        </div>
                                    </div>
                                    <div className="align-end flex-wrap g-3 justify-between">
                                        <div className="data">
                                            <div className="amount fw-bold">Rp. {formatCurrency(dashboard?.cash)}</div>
                                            <div className="info">Total Saldo</div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col md={2}>
                            <Card className="card-bordered border-primary">
                                <div className="card-inner">
                                    <div className="card-title-group align-start mb-2">
                                        <div className="card-title">
                                            <h6 className="title text-soft">NON TUNAI</h6>
                                        </div>
                                        <div className="card-tools">
                                            <Icon name="coins" className="text-primary fs-4" />
                                        </div>
                                    </div>
                                    <div className="align-end flex-wrap g-3 justify-between">
                                        <div className="data">
                                            <div className="amount fw-bold">Rp. {formatCurrency(dashboard?.nonCash)}</div>
                                            <div className="info">Total Saldo</div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="card-bordered border-success">
                                <div className="card-inner">
                                    <div className="card-title-group align-start mb-2">
                                        <div className="card-title">
                                            <h6 className="title text-soft">KREDIT</h6>
                                        </div>
                                        <div className="card-tools">
                                            <Icon name="coins" className="text-success fs-4" />
                                        </div>
                                    </div>
                                    <div className="align-end flex-wrap g-3 justify-between">
                                        <div className="data">
                                            <div className="amount fw-bold">Rp. {formatCurrency(dashboard?.credit)}</div>
                                            <div className="info">Total Transaksi</div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="card-bordered border-danger">
                                <div className="card-inner">
                                    <div className="card-title-group align-start mb-2">
                                        <div className="card-title">
                                            <h6 className="title text-soft">DEBIT</h6>
                                        </div>
                                        <div className="card-tools">
                                            <Icon name="coins" className="danger fs-4" />
                                        </div>
                                    </div>
                                    <div className="align-end flex-wrap g-3 justify-between">
                                        <div className="data">
                                            <div className="amount fw-bold">Rp. {formatCurrency(dashboard?.debit)}</div>
                                            <div className="info">Total Transaksi</div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                    <PreviewCard>
                        <Row className="gy-4">
                            <Col sm={3}>
                                <FormGroup>
                                    <Label>Rekening</Label>
                                    <RSelect
                                        options={accountOptions}
                                        value={accountOptions?.find(opt => opt.value == accountSelected) || { value: 0, label: "Semua Rekening" }}
                                        onChange={(opt) => setAccountSelected(opt?.value || 0)}
                                        placeholder="Pilih Rekening..."
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm={3}>
                                <FormGroup>
                                    <Label>Jenis Transaksi</Label>
                                    <RSelect
                                        options={typeOptions}
                                        value={typeOptions.find(opt => opt.value == typeSelected) || { value: 0, label: "Semua Transaksi" }}
                                        onChange={(opt) => setTypeSelected(opt?.value || 0)}
                                        placeholder="Pilih Transaksi..."
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm={3}>
                                <FormGroup>
                                    <Label>Tanggal Awal</Label>
                                    <div className="form-control-wrap">
                                        <DatePicker
                                            locale="id"
                                            selected={startSelected}
                                            onChange={(date) => setStartSelected(date)}
                                            dateFormat={"dd/MM/yyyy"}
                                            className="form-control date-picker"
                                            placeholderText="Pilih Tanggal"
                                        />
                                    </div>
                                </FormGroup>
                            </Col>
                            <Col sm={3}>
                                <FormGroup>
                                    <Label>Tanggal Akhir</Label>
                                    <div className="form-control-wrap">
                                        <DatePicker
                                            locale="id"
                                            selected={endSelected}
                                            onChange={(date) => setEndSelected(date)}
                                            dateFormat={"dd/MM/yyyy"}
                                            className="form-control date-picker"
                                            placeholderText="Pilih Tanggal"
                                        />
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>
                        <ReactDataTable data={transactions} columns={Column} pagination progressPending={loadData} />
                    </PreviewCard>
                </Block>
                <Partial modal={modal} setModal={setModal} setLoadData={setLoadData} />
            </Content>
        </React.Fragment>
    )
}

export default Cashflow