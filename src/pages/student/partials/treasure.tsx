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
import type { ColumnType, StudentTreasurerType } from "@/types";
import { studentTreasurer } from "@/common/api/student";
import moment from "moment/moment";

const StudentTreasure = () => {
    const year = useYearContext()
    const institution = useInstitutionContext()
    const [sm, updateSm] = useState(false)
    const [loadData, setLoadData] = useState(true)
    const [students, setStudents] = useState<StudentTreasurerType[]>([])
    const Column: ColumnType<StudentTreasurerType>[] = [
        {
            name: "Nama",
            selector: (row) => row?.name,
            sortable: false,
        },
        {
            name: "Tempat, Tanggal Lahir",
            selector: (row) => row?.birthPlace + ', ' + moment(row?.birthDate, 'YYYY-MM-DD').format('DD MMMM YYYY'),
            sortable: false,
        },
        {
            name: "Nama Wali",
            selector: (row) => row?.guardName,
            sortable: false,
        },
        {
            name: "Alamat",
            selector: (row) => row?.address,
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
    ];

    useEffect(() => {
        studentTreasurer<StudentTreasurerType>({ yearId: year?.id, institutionId: institution?.id })
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
                                <BlockTitle tag="h5">Data Tahun Pelajaran</BlockTitle>
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

export default StudentTreasure;