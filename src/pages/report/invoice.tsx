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
    Icon
} from "@/components";
import { useYearContext } from "@/common/hooks/useYearContext";
import { Badge, Button, FormGroup, Label, Row, Col } from "reactstrap";
import { formatCurrency, getStatusInvoice } from "@/helpers";
import { getInvoiceReport, exportInvoiceReport } from "@/common/api/report";
import type { ColumnType, InvoiceType, OptionsType } from "@/types";
import { RSelect } from "@/components";
import { useAuthContext } from "@/common/hooks/useAuthContext";
import { get as getInstitution } from "@/common/api/institution";

const InvoiceReport = () => {
    const year = useYearContext();
    const { user } = useAuthContext();
    const [loadData, setLoadData] = useState(true);
    const [invoices, setInvoices] = useState<InvoiceType[]>([]);
    const [institutions, setInstitutions] = useState<OptionsType[]>([]);
    const [institutionId, setInstitutionId] = useState(user?.institutionId ? user.institutionId : 0);
    const [statusFilter, setStatusFilter] = useState("");

    const statusOptions = [
        { value: "", label: "Semua Status" },
        { value: "PAID", label: "LUNAS" },
        { value: "PENDING", label: "PROSES" },
        { value: "UNPAID", label: "BELUM DIBAYAR" },
    ];

    const Column: ColumnType<InvoiceType>[] = [
        {
            name: "Nomor Invoice",
            selector: (row) => row.reference || '-',
            sortable: true,
        },
        {
            name: "Siswa",
            selector: (row: any) => row.student_name,
            sortable: true,
        },
        {
            name: "Jumlah",
            selector: (row: any) => formatCurrency(row.original_amount),
            sortable: true,
        },
        {
            name: "Jatuh Tempo",
            selector: (row) => row.dueDate,
            sortable: true,
        },
        {
            name: "Status",
            selector: (row) => row.status,
            sortable: false,
            cell: (row) => (
                <Badge
                    pill
                    color={getStatusInvoice(row.status)}
                >
                    {row.status}
                </Badge>
            )
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

    const handleExport = () => {
        const params: Record<string, any> = { yearId: year?.id };
        if (institutionId) params.institutionId = institutionId;
        if (statusFilter) params.status = statusFilter;
        exportInvoiceReport(params);
    };

    const handlePrint = () => {
        const params: string[] = [];
        if (year?.id) params.push(`yearId=${year.id}`);
        if (institutionId) params.push(`institutionId=${institutionId}`);
        if (statusFilter) params.push(`status=${statusFilter}`);

        window.open(`/laporan/tagihan/cetak?${params.join("&")}`, "_blank");
    };

    useEffect(() => {
        if (year?.id) {
            setLoadData(true);
            const params: Record<string, any> = { yearId: year.id };
            if (institutionId) params.institutionId = institutionId;
            if (statusFilter) params.status = statusFilter;

            getInvoiceReport<InvoiceType>(params)
                .then((resp) => {
                    setInvoices(resp);
                })
                .finally(() => {
                    setLoadData(false);
                });
        }
    }, [year, institutionId, statusFilter, user]);

    return (
        <React.Fragment>
            <Head title="Laporan Tagihan" />
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Laporan Tagihan</BlockTitle>
                                <p>
                                    Rekapitulasi data tagihan Tahun Ajaran {year?.name}
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
                            <Col sm={6}>
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
                            <Col sm={6}>
                                <FormGroup>
                                    <Label>Status</Label>
                                    <RSelect
                                        options={statusOptions}
                                        value={statusOptions.find(opt => opt.value === statusFilter)}
                                        onChange={(opt) => setStatusFilter(opt?.value || "")}
                                        placeholder="Pilih Status..."
                                    />
                                </FormGroup>
                            </Col>
                        </Row>

                        <ReactDataTable
                            data={invoices}
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

export default InvoiceReport;
