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
import { RSelect } from "@/components";
import { useAuthContext } from "@/common/hooks/useAuthContext";
import { get as getInstitution } from "@/common/api/institution";
import { get as getPrograms } from "@/common/api/institution/program";
import { get as getBoarding } from "@/common/api/master/boarding";
import { GENDER_OPTIONS } from "@/common/constants";
import type { ColumnType, InvoiceType, OptionsType } from "@/types";

const InvoiceReportStudent = () => {
    const year = useYearContext();
    const { user } = useAuthContext();
    const [loadData, setLoadData] = useState(true);
    const [invoices, setInvoices] = useState<InvoiceType[]>([]);
    const [institutions, setInstitutions] = useState<OptionsType[]>([]);
    const [institutionId, setInstitutionId] = useState(user?.institutionId ? user.institutionId : 0);
    const [statusFilter, setStatusFilter] = useState("");
    const [genderSelected, setGenderSelected] = useState<number>(0);
    const [programOptions, setProgramOptions] = useState<OptionsType[]>();
    const [programSelected, setProgramSelected] = useState<number>(0);
    const [boardingOptions, setBoardingOptions] = useState<OptionsType[]>();
    const [boardingSelected, setBoardingSelected] = useState<number>(0);

    const statusOptions: OptionsType[] = [
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
            width: "280px"
        },
        {
            name: "Program",
            selector: (row: any) => row.program_name,
            sortable: true,
        },
        {
            name: "Jumlah",
            selector: (row: any) => formatCurrency(row.original_invoice),
            sortable: false,
            right: "true"
        },
        {
            name: "Potongan",
            selector: (row: any) => formatCurrency(row.discount),
            sortable: false,
            right: "true"
        },
        {
            name: "Total",
            selector: (row: any) => formatCurrency(row.original_amount),
            sortable: false,
            right: "true"
        },
        {
            name: "Terbayar",
            selector: (row: any) => formatCurrency(row.payment),
            sortable: false,
            right: "true"
        },
        {
            name: "Sisa Tagihan",
            selector: (row: any) => formatCurrency(row.unpaid),
            sortable: false,
            right: "true"
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

    useEffect(() => {
        const fetchData = async () => {
            await getInstitution<OptionsType>({ type: 'select' }).then((resp) => {
                setInstitutions(resp)
            })
            await getPrograms<OptionsType>({ type: 'select', yearId: year?.id, institutionId: institutionId }).then((resp) => {
                setProgramOptions([{ value: 0, label: 'Semua' }, ...resp])
            })
            await getBoarding<OptionsType>({ type: 'select' }).then((resp) => {
                setBoardingOptions([{ value: 0, label: 'Semua' }, ...resp])
            })
        }
        fetchData();
    }, []);


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
        if (genderSelected) params.push(`gender=${genderSelected}`);
        if (programSelected) params.push(`programId=${programSelected}`);
        if (boardingSelected) params.push(`boardingId=${boardingSelected}`);
        if (statusFilter) params.push(`status=${statusFilter}`);

        window.open(`/laporan/tagihan/cetak?${params.join("&")}`, "_blank");
    };
    useEffect(() => {
        let cancelled = false;

        const params: Record<string, any> = {
            type: 'datatable',
            yearId: year?.id,
            institutionId: institutionId,
        };
        if (genderSelected !== 0) params.gender = genderSelected;
        if (programSelected !== 0) params.programId = programSelected;
        if (boardingSelected !== 0) params.boardingId = boardingSelected;
        if (statusFilter !== "") params.status = statusFilter;

        setLoadData(true);
        getInvoiceReport<InvoiceType>(params)
            .then((resp) => {
                if (!cancelled) setInvoices(resp);
            })
            .finally(() => {
                if (!cancelled) setLoadData(false);
            });

        return () => {
            cancelled = true;
        };
    }, [year, institutionId, genderSelected, programSelected, boardingSelected, statusFilter]);

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
                        <Row className="gy-4">
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
                            <Col sm={2}>
                                <FormGroup>
                                    <Label>Jenis Kelamin</Label>
                                    <RSelect
                                        options={[{ value: 0, label: 'Semua' }, ...GENDER_OPTIONS]}
                                        value={GENDER_OPTIONS.find(opt => opt.value === genderSelected) || { value: 0, label: "Semua" }}
                                        onChange={(opt) => setGenderSelected(opt?.value || 0)}
                                        placeholder="Pilih Jenis Kelamin"
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm={2}>
                                <FormGroup>
                                    <Label>Program Madrasah</Label>
                                    <RSelect
                                        options={programOptions}
                                        value={programOptions?.find(opt => opt.value === programSelected)}
                                        onChange={(opt) => setProgramSelected(opt?.value || 0)}
                                        placeholder="Pilih Program"
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm={2}>
                                <FormGroup>
                                    <Label>Program Pondok</Label>
                                    <RSelect
                                        options={boardingOptions}
                                        value={boardingOptions?.find(opt => opt.value === boardingSelected)}
                                        onChange={(opt) => setBoardingSelected(opt?.value || 0)}
                                        placeholder="Pilih Program"
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm={2}>
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

export default InvoiceReportStudent;
