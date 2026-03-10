import React, { useEffect, useState } from "react";
import Head from "@/layout/head";
import Content from "@/layout/content";
import { useYearContext } from "@/common/hooks/useYearContext";
import {
    Block,
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Button,
    Icon,
    PreviewCard,
    ReactDataTable,
    RSelect
} from "@/components";
import type { ColumnType, OptionsType, StudentBoardingType } from "@/types";
import moment from "moment";
import { Badge } from "reactstrap";
import SignRoom from "./partials";
import { apiCore } from "@/common/api/core";
import { get as getRooms } from "@/common/api/master/room";
import { get as getInstitution } from "@/common/api/institution";
import { get as getBoarding } from "@/common/api/master/boarding";
import { studentBoarding } from "@/common/api/student";
import type { RoomType } from "@/types";
import { GENDER_OPTIONS } from "@/common/constants";

const StudentCottage = () => {
    const year = useYearContext();
    const api = new apiCore();
    const [loadData, setLoadData] = useState(true);
    const [students, setStudents] = useState<StudentBoardingType[]>([]);
    const [institutions, setInstitutions] = useState<OptionsType[]>([]);
    const [boardings, setBoardings] = useState<OptionsType[]>([]);
    const [rooms, setRooms] = useState<RoomType[]>([]);
    const [institutionFilter, setInstitutionFilter] = useState<OptionsType | null>(null);
    const [boardingFilter, setBoardingFilter] = useState<OptionsType | null>(null);
    const [genderFilter, setGenderFilter] = useState<OptionsType | null>(null);
    const [modal, setModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<StudentBoardingType | null>(null);
    const [sm, updateSm] = useState<boolean>(false);
    const genderOptions: OptionsType[] = [
        ...[{ value: 0, label: 'Semua' }],
        ...GENDER_OPTIONS
    ]

    const Column: ColumnType<StudentBoardingType>[] = [
        {
            name: "Nama Lembaga",
            selector: (row) => row.institution || '-',
            sortable: false,
            width: "150px",
        },
        {
            name: "Nama",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "TTL",
            selector: (row) => `${row.birthPlace}, ${moment(row.birthDate).format('DD/MM/YYYY')}`,
            sortable: false,
            width: "180px",
        },
        {
            name: "JK",
            selector: (row) => row.gender === 1 ? 'L' : 'P',
            sortable: true,
            width: "120px",
        },
        {
            name: "Wali",
            selector: (row) => row.guardName || '-',
            sortable: false,
        },
        {
            name: "Alamat",
            selector: (row) => row.address || '-',
            sortable: false,
            width: "200px",
        },
        {
            name: "Boarding",
            selector: (row) => row.boarding || '-',
            sortable: true,
            width: "120px",
        },
        {
            name: "Kamar",
            selector: (row) => row.room || '-',
            sortable: false,
            width: "100px",
            cell: (row) => (
                row.room ? (
                    <Badge color="success" pill>{row.room}</Badge>
                ) : (
                    <Badge color="warning" pill>Belum diatur</Badge>
                )
            ),
        },
        {
            name: "Aksi",
            selector: (row) => row?.id,
            sortable: false,
            width: "120px",
            cell: (row) => (
                <Button
                    size="sm"
                    color="primary"
                    outline
                    onClick={() => {
                        setSelectedStudent(row);
                        setModal(true);
                    }}
                >
                    <Icon name="edit" />
                </Button>
            ),
        },
    ];

    useEffect(() => {
        const getData = async () => {
            await getInstitution<OptionsType>({ type: 'select' }).then((resp) => {
                setInstitutions([...[{ value: 0, label: 'Semua Lembaga' }], ...resp]);
            })
            await getBoarding<OptionsType>({ type: 'select' }).then((resp) => {
                setBoardings([...[{ value: 0, label: 'Semua Program' }], ...resp]);
            })
            await getRooms({ list: 'select' }).then((resp: any) => {
                setRooms(resp);
            });
        };
        getData();
    }, []);

    // Fetch students with filters
    const fetchStudents = () => {
        if (year?.id) {
            setLoadData(true);
            const params: any = {
                yearId: year.id,
                verified: 1,
                paid: 1,
                boarding: true,
            };

            if (institutionFilter && institutionFilter.value !== 0) params.institutionId = institutionFilter.value;
            if (boardingFilter && boardingFilter.value !== 0) params.boardingId = boardingFilter.value;
            if (genderFilter && genderFilter.value !== 0) params.gender = genderFilter.value;

            studentBoarding(params)
                .then((resp) => setStudents(resp))
                .finally(() => setLoadData(false));
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [year, institutionFilter, boardingFilter, genderFilter]);



    const handlePrint = () => {
        if (!year?.id) return;

        const params: any = {
            yearId: year.id,
            yearName: year.name,
        };

        if (institutionFilter && institutionFilter.value !== 0) params.institutionId = institutionFilter.value;
        if (boardingFilter && boardingFilter.value !== 0) params.boardingId = boardingFilter.value;
        if (genderFilter && genderFilter.value !== 0) params.gender = genderFilter.value;

        const queryString = new URLSearchParams(params).toString();
        window.open(`/laporan/boarding/cetak?${queryString}`, '_blank');
    };

    const handleExport = async () => {
        if (!year?.id) return;

        const params: any = {
            yearId: year.id,
            verified: 1,
            paid: 1,
            boarding: true,
        };

        if (institutionFilter && institutionFilter.value !== 0) params.institutionId = institutionFilter.value;
        if (boardingFilter && boardingFilter.value !== 0) params.boardingId = boardingFilter.value;
        if (genderFilter && genderFilter.value !== 0) params.gender = genderFilter.value;

        await api.getFile('/student/boarding-report/export', params).then((resp: any) => {
            const url = window.URL.createObjectURL(new Blob([resp.data]));
            const link = document.createElement('a');
            link.href = url;
            const contentDisposition = resp.headers['content-disposition'];
            let fileName = 'laporan-boarding.xlsx';
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                if (fileNameMatch && fileNameMatch.length === 2)
                    fileName = fileNameMatch[1];
            }
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        });
    };

    const roomOptions: OptionsType[] = rooms.map((room) => ({
        value: room.id!,
        label: `${room.name} (${room.capacity} santri)`
    }));

    return (
        <React.Fragment>
            <Head title="Data Santri Boarding" />
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Data Santri Boarding</BlockTitle>
                                <p>
                                    Data santri yang sudah terverifikasi dan menyelesaikan pembayaran - Tahun
                                    Ajaran {year?.name}
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
                                                    color="primary"
                                                    size="sm"
                                                    outline
                                                    className="btn-white"
                                                    onClick={handlePrint}
                                                >
                                                    <Icon name="printer" />
                                                    <span>Cetak</span>
                                                </Button>
                                            </li>
                                            <li>
                                                <Button
                                                    color="success"
                                                    size="sm"
                                                    outline
                                                    className="btn-white"
                                                    onClick={handleExport}
                                                >
                                                    <Icon name="download" />
                                                    <span>Export Excel</span>
                                                </Button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </BlockHeadContent>
                        </BlockBetween>
                    </BlockHead>

                    {/* Filters */}
                    <PreviewCard className="mb-3">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label">Filter Lembaga</label>
                                <RSelect
                                    options={institutions}
                                    value={institutionFilter}
                                    onChange={(val) => setInstitutionFilter(val)}
                                    placeholder="Semua Lembaga"
                                    isClearable
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Filter Program Boarding</label>
                                <RSelect
                                    options={boardings}
                                    value={boardingFilter}
                                    onChange={(val) => setBoardingFilter(val)}
                                    placeholder="Semua Program"
                                    isClearable
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Filter Jenis Kelamin</label>
                                <RSelect
                                    options={genderOptions}
                                    value={genderFilter}
                                    onChange={(val) => setGenderFilter(val)}
                                    placeholder="Semua Jenis Kelamin"
                                    isClearable
                                />
                            </div>
                        </div>
                    </PreviewCard>
                    <SignRoom
                        modal={modal}
                        setModal={setModal}
                        selectedStudent={selectedStudent}
                        roomOptions={roomOptions}
                        handleRefresh={fetchStudents}
                    />
                    <PreviewCard>
                        <ReactDataTable
                            data={students}
                            columns={Column}
                            pagination
                            progressPending={loadData}
                        />
                    </PreviewCard>
                </Block>
            </Content>

            {/* Room Assignment Modal */}

        </React.Fragment>
    );
};

export default StudentCottage;
