import React, { useEffect, useState } from "react";
import Head from "@/layout/head";
import Content from "@/layout/content";
import { useYearContext } from "@/common/hooks/useYearContext";
import { useInstitutionContext } from "@/common/hooks/useInstitutionContext";
import {
    Block,
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Button,
    Icon,
    PreviewCard,
    ReactDataTable
} from "@/components";
import type { ColumnType, StudentOperatorType } from "@/types";
import { studentTreasurer } from "@/common/api/student";
import moment from "moment/moment";
import { ButtonGroup, Spinner } from "reactstrap";
import { destroy as destroyYear } from "@/common/api/master/year";
import { useNavigate } from "react-router-dom";

const StudentOperator = () => {
    const year = useYearContext()
    const institution = useInstitutionContext()
    const navigate = useNavigate()
    const [sm, updateSm] = useState(false)
    const [loading, setLoading] = useState<boolean | number | undefined>(false)
    const [loadData, setLoadData] = useState(true)
    const [students, setStudents] = useState<StudentOperatorType[]>([])
    const Column: ColumnType<StudentOperatorType>[] = [
        {
            name: "Nama",
            selector: (row) => row?.name,
            sortable: false,
        },
        {
            name: "Tempat Lahir",
            selector: (row) => row?.birthPlace,
            sortable: false,
        },
        {
            name: "Tanggal Lahir",
            selector: (row) => moment(row?.birthDate, 'YYYY-MM-DD').format('DD MMMM YYYY'),
            sortable: false,
        },
        {
            name: "Nama Wali",
            selector: (row) => row?.guardName,
            sortable: false,
        },
        {
            name: "Program",
            selector: (row) => row?.program,
            sortable: false,
        },
        {
            name: "Boarding",
            selector: (row) => row?.boarding,
            sortable: false,
        },
        {
            name: "Aksi",
            selector: (row) => row?.id,
            sortable: false,
            width: "150px",
            cell: (row) => (
                <ButtonGroup size="sm">
                    <Button outline color="warning" onClick={() => navigate(`/data-pendaftar/${row.userId}/ubah`)}>
                        <Icon name="pen" />
                    </Button>
                    <Button outline color="danger" onClick={async () => {
                        setLoading(row?.id);
                        await destroyYear(row?.id)
                            .then(() => setLoadData(true))
                            .finally(() => setLoading(false));
                    }}>
                        {loading === row.id ? <Spinner size="sm" /> : <Icon name="trash" />}
                    </Button>
                </ButtonGroup>
            ),
        },
    ];

    useEffect(() => {
        studentTreasurer({ yearId: year?.id, institutionId: institution?.id })
            .then((resp) => setStudents(resp))
            .finally(() => setLoadData(false))
    }, []);
    return (
        <React.Fragment>
            <Head title="Data Pendaftar" />
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Data Pendaftar</BlockTitle>
                                <p>
                                    Data Semua pendaftar {institution?.surname} Tahun Ajaran {year?.name}
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
                                                <Button color="primary" size="sm" outline className="btn-white"
                                                    onClick={() => navigate('/data-pendaftar/tambah')}>
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
                    <PreviewCard>
                        <ReactDataTable data={students} columns={Column} pagination progressPending={loadData} />
                    </PreviewCard>
                </Block>
            </Content>
        </React.Fragment>
    )
}

export default StudentOperator;