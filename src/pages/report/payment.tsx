import React, { useEffect, useState } from "react";
import Head from "@/layout/head";
import Content from "@/layout/content";
import {
    Block,
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    PreviewCard,
    ReactDataTable,
    RSelect,
    Icon,
} from "@/components";
import { useYearContext } from "@/common/hooks/useYearContext";
import { Button, FormGroup, Label, Row, Col } from "reactstrap";
import { formatCurrency } from "@/helpers";
import { getPaymentReport, exportPaymentReport } from "@/common/api/report";
import type { ColumnType, OptionsType } from "@/types";
import moment from "moment";
import DatePicker, { registerLocale } from "react-datepicker";
import { id } from "date-fns/locale/id";
import { useAuthContext } from "@/common/hooks/useAuthContext";
import { get as getInstitution } from "@/common/api/institution";

registerLocale('id', id);

type PaymentReportType = {
    id: number;
    name: string;
    reference: string;
    method: number;
    status: number;
    transaction_id: string;
    transaction_time: string;
    amount: number;
}

const PaymentReport = () => {
    const year = useYearContext();
    const { user } = useAuthContext();
    const [loadData, setLoadData] = useState(true);
    const [payments, setPayments] = useState<PaymentReportType[]>([]);
    const [institutions, setInstitutions] = useState<OptionsType[]>([]);
    const [institutionId, setInstitutionId] = useState(user?.institutionId ? user.institutionId : 0);
    const [methodFilter, setMethodFilter] = useState("");
    const [dateFrom, setDateFrom] = useState<Date | null>(null);
    const [dateTo, setDateTo] = useState<Date | null>(null);

    const methodOptions = [
        { value: "", label: "Semua Metode" },
        { value: "1", label: "Cash" },
        { value: "2", label: "Midtrans" },
    ];

    const Column: ColumnType<PaymentReportType>[] = [
        {
            name: "Waktu",
            selector: (row) => moment(row.transaction_time).format('DD/MM/YYYY HH:mm'),
            sortable: true,
            width: "180px",
        },
        {
            name: "Siswa",
            selector: (row) => row.name,
            sortable: true,
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
        },
        {
            name: "Jumlah",
            selector: (row) => formatCurrency(row.amount),
            sortable: true,
        },
        {
            name: "ID Transaksi",
            selector: (row) => row.transaction_id,
            sortable: false,
        },
    ];

    // Load institutions
    useEffect(() => {
        const fetchData = async () => {
            await getInstitution<OptionsType>({ type: 'select' }).then((resp) => {
                setInstitutions(resp)
            })
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (user?.institutionId) {
            setInstitutionId(user.institutionId);
        }
    }, [user]);

    const handlePrint = () => {
        const params: string[] = [];
        if (year?.id) params.push(`yearId=${year.id}`);
        if (institutionId) params.push(`institutionId=${institutionId}`);
        if (methodFilter) params.push(`method=${methodFilter}`);
        if (dateFrom) params.push(`dateFrom=${moment(dateFrom).format("YYYY-MM-DD")}`);
        if (dateTo) params.push(`dateTo=${moment(dateTo).format("YYYY-MM-DD")}`);

        window.open(`/laporan/pembayaran/cetak?${params.join("&")}`, "_blank");
    };

    const handleExport = () => {
        const params: Record<string, any> = { yearId: year?.id };
        if (institutionId) params.institutionId = institutionId;
        if (methodFilter) params.method = methodFilter;
        if (dateFrom) params.dateFrom = moment(dateFrom).format("YYYY-MM-DD");
        if (dateTo) params.dateTo = moment(dateTo).format("YYYY-MM-DD");
        exportPaymentReport(params);
    };

    useEffect(() => {
        if (year?.id) {
            setLoadData(true);
            const params: Record<string, any> = { yearId: year.id };
            if (institutionId) params.institutionId = institutionId;
            if (methodFilter) params.method = methodFilter;
            if (dateFrom) params.dateFrom = moment(dateFrom).format("YYYY-MM-DD");
            if (dateTo) params.dateTo = moment(dateTo).format("YYYY-MM-DD");

            getPaymentReport<PaymentReportType>(params)
                .then((resp) => {
                    setPayments(resp);
                })
                .finally(() => {
                    setLoadData(false);
                });
        }
    }, [year, institutionId, methodFilter, dateFrom, dateTo, user]);

    return (
        <React.Fragment>
            <Head title="Laporan Pembayaran" />
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Laporan Pembayaran</BlockTitle>
                                <p>
                                    Rekapitulasi data pembayaran Tahun Ajaran {year?.name}
                                </p>
                            </BlockHeadContent>
                            <BlockHeadContent>
                                <Button color="success" outline onClick={handlePrint} className="me-2">
                                    <Icon name="printer" />
                                    <span className="d-none d-sm-inline-block">Cetak</span>
                                </Button>
                                <Button color="info" outline onClick={handleExport}>
                                    <Icon name="file-xls" />
                                    <span className="d-none d-sm-inline-block">Export</span>
                                </Button>
                            </BlockHeadContent>
                        </BlockBetween>
                    </BlockHead>
                    <PreviewCard>
                        <Row className="gy-4 mb-4">
                            <Col sm={3}>
                                <FormGroup>
                                    <Label>Lembaga</Label>
                                    <RSelect
                                        options={[{ value: 0, label: "Semua Lembaga" }, ...institutions]}
                                        value={institutions.find(opt => opt.value == institutionId) || { value: 0, label: "Semua Lembaga" }}
                                        onChange={(opt) => setInstitutionId(opt?.value || 0)}
                                        placeholder="Pilih Lembaga..."
                                        isDisabled={!!user?.institutionId}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm={3}>
                                <FormGroup>
                                    <Label>Filter Metode</Label>
                                    <RSelect
                                        options={methodOptions}
                                        value={methodOptions.find(opt => opt.value === methodFilter)}
                                        onChange={(opt) => setMethodFilter(opt?.value || "")}
                                        placeholder="Pilih Metode..."
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm={3}>
                                <FormGroup>
                                    <Label>Dari Tanggal</Label>
                                    <div className="form-control-wrap">
                                        <DatePicker
                                            locale="id"
                                            selected={dateFrom}
                                            onChange={(date) => setDateFrom(date)}
                                            dateFormat={"dd/MM/yyyy"}
                                            className="form-control date-picker"
                                            placeholderText="Pilih Tanggal"
                                        />
                                    </div>
                                </FormGroup>
                            </Col>
                            <Col sm={3}>
                                <FormGroup>
                                    <Label>Sampai Tanggal</Label>
                                    <div className="form-control-wrap">
                                        <DatePicker
                                            locale="id"
                                            selected={dateTo}
                                            onChange={(date) => setDateTo(date)}
                                            dateFormat={"dd/MM/yyyy"}
                                            className="form-control date-picker"
                                            placeholderText="Pilih Tanggal"
                                        />
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>
                        <ReactDataTable
                            data={payments}
                            columns={Column}
                            pagination
                            progressPending={loadData}
                        />
                    </PreviewCard>
                </Block>
            </Content>
        </React.Fragment>
    );
};

export default PaymentReport;
