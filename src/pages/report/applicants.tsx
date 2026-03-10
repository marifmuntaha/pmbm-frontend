import React, { useEffect, useState } from "react";
import Head from "@/layout/head";
import Content from "@/layout/content";
import {
    Block,
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Icon,
    PreviewCard,
    ReactDataTable,
    RSelect,
} from "@/components";
import { useYearContext } from "@/common/hooks/useYearContext";
import { Badge, Button, FormGroup, Label, Row, Col } from "reactstrap";
import { getApplicantReport, exportApplicantReport } from "@/common/api/report";
import { get as getInstitutions } from "@/common/api/institution";
import { get as getBoardings } from "@/common/api/master/boarding";
import { get as getProgram } from "@/common/api/institution/program";
import type { ColumnType, OptionsType } from "@/types";
import { getGender } from "@/helpers";

type ApplicantType = {
    id: number;
    name: string;
    nisn: string;
    gender: number;
    institution: string;
    program: string;
    boarding: string;
    verified: boolean;
    created_at: string;
}

const ApplicantsReport = () => {
    const year = useYearContext();
    const [loadData, setLoadData] = useState(true);
    const [applicants, setApplicants] = useState<ApplicantType[]>([]);
    const [institutions, setInstitutions] = useState<OptionsType[]>([]);
    const [programs, setPrograms] = useState<OptionsType[]>([]);
    const [boardings, setBoarding] = useState<OptionsType[]>([]);

    // Filters
    const [institutionId, setInstitutionId] = useState(0);
    const [programId, setProgramId] = useState(0);
    const [statusFilter, setStatusFilter] = useState("");
    const [boardingId, setBoardingId] = useState(0);

    const statusOptions = [
        { value: "", label: "Semua Status" },
        { value: "verified", label: "Terverifikasi" },
        { value: "pending", label: "Pending" },
    ];

    const Column: ColumnType<ApplicantType>[] = [
        {
            name: "Nama",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "NISN",
            selector: (row) => row.nisn,
            sortable: true,
        },
        {
            name: "Jenis Kelamin",
            selector: (row) => getGender(row.gender),
            sortable: true,
        },
        {
            name: "Lembaga",
            selector: (row) => row.institution,
            sortable: true,
        },
        {
            name: "Program",
            selector: (row) => row.program,
            sortable: true,
        },
        {
            name: "Boarding",
            selector: (row) => row.boarding,
            sortable: true,
        },
        {
            name: "Status",
            selector: (row) => row.verified ? 'Terverifikasi' : 'Pending',
            sortable: false,
            cell: (row) => (
                <Badge
                    pill
                    color={row.verified ? 'success' : 'warning'}
                >
                    {row.verified ? 'Terverifikasi' : 'Pending'}
                </Badge>
            )
        },
    ];

    // Load initial data
    useEffect(() => {
        // Fetch institutions
        getInstitutions<OptionsType>({ type: 'select' }).then((result) => {
            setInstitutions(result);
        });

        // Fetch boardings
        getBoardings<OptionsType>({ type: 'select' }).then((result) => {
            setBoarding(result);
        });
    }, []);

    // Load programs when institution changes
    useEffect(() => {
        if (institutionId) {
            getProgram<OptionsType>({ institutionId: institutionId, type: 'select' }).then((result) => {
                setPrograms(result);
            });
        } else {
            setPrograms([]);
            setProgramId(0);
        }
    }, [institutionId]);

    // Fetch report data
    useEffect(() => {
        if (year?.id) {
            setLoadData(true);
            const params: Record<string, any> = { yearId: year.id };
            if (institutionId) params.institutionId = institutionId;
            if (programId) params.programId = programId;
            if (statusFilter) params.status = statusFilter;
            if (boardingId) params.boardingId = boardingId;

            getApplicantReport<ApplicantType>(params)
                .then((resp) => {
                    setApplicants(resp);
                })
                .catch(() => {
                    setApplicants([]);
                })
                .finally(() => {
                    setLoadData(false);
                });
        }
    }, [year, institutionId, programId, statusFilter, boardingId]);

    const handleExport = () => {
        const params: Record<string, any> = { yearId: year?.id };
        if (institutionId) params.institutionId = institutionId;
        if (programId) params.programId = programId;
        if (statusFilter) params.status = statusFilter;
        if (boardingId) params.boardingId = boardingId;
        exportApplicantReport(params);
    };

    const handlePrint = () => {
        let url = `/laporan/pendaftar/cetak?yearId=${year?.id}`;
        if (institutionId) url += `&institutionId=${institutionId}`;
        if (programId) url += `&programId=${programId}`;
        if (boardingId) url += `&boardingId=${boardingId}`;
        if (statusFilter) url += `&status=${statusFilter}`;

        window.open(url, "_blank");
    };

    return (
        <React.Fragment>
            <Head title="Laporan Pendaftar" />
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Laporan Pendaftar</BlockTitle>
                                <p>
                                    Rekapitulasi data pendaftar Tahun Ajaran {year?.name}
                                </p>
                            </BlockHeadContent>
                            <BlockHeadContent>
                                <Button outline color="success" onClick={handlePrint} className="me-2">
                                    <Icon name="printer" /> <span>Cetak</span>
                                </Button>
                                <Button outline color="info" onClick={handleExport}>
                                    <Icon name="file-xls" /> <span>Excel</span>
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
                                        value={institutions.find(opt => opt.value === institutionId) || { value: 0, label: "Semua Lembaga" }}
                                        onChange={(opt) => setInstitutionId(opt?.value || 0)}
                                        placeholder="Pilih Lembaga..."
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm={3}>
                                <FormGroup>
                                    <Label>Program</Label>
                                    <RSelect
                                        options={[{ value: 0, label: "Semua Program" }, ...programs]}
                                        value={programs.find(opt => opt.value === programId) || { value: 0, label: "Semua Program" }}
                                        onChange={(opt) => setProgramId(opt?.value || 0)}
                                        placeholder="Pilih Program..."
                                        isDisabled={!institutionId}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm={3}>
                                <FormGroup>
                                    <Label>Status Verifikasi</Label>
                                    <RSelect
                                        options={statusOptions}
                                        value={statusOptions.find(opt => opt.value === statusFilter)}
                                        onChange={(opt) => setStatusFilter(opt?.value || "")}
                                        placeholder="Pilih Status..."
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm={3}>
                                <FormGroup>
                                    <Label>Program Boarding</Label>
                                    <RSelect
                                        options={[{ value: 0, label: "Semua Boarding" }, ...boardings]}
                                        value={boardings.find(opt => opt.value === boardingId) || { value: 0, label: "Semua Boarding" }}
                                        onChange={(opt) => setBoardingId(opt?.value || 0)}
                                        placeholder="Pilih Boarding..."
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <ReactDataTable
                            data={applicants}
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

export default ApplicantsReport;
