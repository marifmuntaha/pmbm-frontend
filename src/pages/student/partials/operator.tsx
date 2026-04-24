import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    Col,
    Icon,
    PreviewCard,
    ReactDataTable,
    Row,
    RSelect
} from "@/components";
import type {
    ColumnType,
    OptionsType,
    StudentAddressType, StudentFileType,
    StudentOperatorType, StudentOriginType,
    StudentParentType,
    StudentPersonalType, StudentProgramType, StudentVerificationType
} from "@/types";
import { studentTreasurer } from "@/common/api/student";
import { sendWhatsAppRegistrationProof } from "@/common/api/student/registration";
import moment from "moment/moment";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Label, Spinner } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RegistrationProof from "@/pages/print/components/RegistrationProof";
import { get as getPersonal } from "@/common/api/student/personal";
import { get as getParent } from "@/common/api/student/parent";
import { get as getAddress } from "@/common/api/student/address";
import { get as getProgram } from "@/common/api/student/program";
import { get as getOrigin } from "@/common/api/student/origin";
import { get as getFile } from "@/common/api/student/file";
import { get as getVerification } from "@/common/api/student/verivication";
import { get as getPrograms } from "@/common/api/institution/program";
import { get as getBoarding } from "@/common/api/master/boarding";
import { useReactToPrint } from "react-to-print";
import { getGender } from "@/helpers";
import { GENDER_OPTIONS, STUDENT_STATUS } from "@/common/constants";

interface ActionCellProps {
    row: StudentOperatorType;
    loading: number | string | null;
    sendingWa: number | string | null;
    onPrint: (userId: number | undefined) => void;
    onNavigate: (path: string) => void;
    onSendWa: (userId: number | string) => void;
}

const ActionCell = React.memo(({ row, loading, sendingWa, onPrint, onNavigate, onSendWa }: ActionCellProps) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Dropdown isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
            <DropdownToggle className="btn-action" color="light" size="xs" disabled={loading === row.userId || sendingWa === row.userId}>
                {loading === row.userId || sendingWa === row.userId ? <Spinner size="sm" /> : <Icon name="more-h" />}
            </DropdownToggle>
            <DropdownMenu>
                <ul className="link-list-opt">
                    <li>
                        <DropdownItem tag="a" href="#links" onClick={(e) => {
                            e.preventDefault();
                            onPrint(row.userId);
                        }}>
                            {loading === row.userId ? <Spinner size="sm" /> : <Icon name="printer" color="info" />}<span>Cetak Formulir</span>
                        </DropdownItem>
                    </li>
                    <li>
                        <DropdownItem tag="a" href="#links" onClick={() => onNavigate(`/data-pendaftar/${row.userId}/ubah`)}>
                            <Icon name="pen" /><span>Ubah/Perbarui</span>
                        </DropdownItem>
                    </li>
                    <li>
                        <DropdownItem tag="a" href="#links" onClick={() => onSendWa(row.userId as string | number)}>
                            {sendingWa === row.userId ? <Spinner size="sm" /> : <Icon name="whatsapp" />} <span>Kirim Notifikasi</span>
                        </DropdownItem>
                    </li>
                </ul>
            </DropdownMenu>
        </Dropdown>
    );
});

// ---------------------------------------------------------------------------

const StudentOperator = () => {
    const year = useYearContext()
    const institution = useInstitutionContext()
    const navigate = useNavigate()
    const [sm, updateSm] = useState(false)
    const [sendingWa, setSendingWa] = useState<number | string | null>(null)
    const [sendingBuckWa, setSendingBuckWa] = useState(false)
    const [loading, setLoading] = useState<number | string | null>(null);
    const [loadData, setLoadData] = useState(true)
    const [students, setStudents] = useState<StudentOperatorType[]>([])
    const [data, setData] = useState<{
        personal?: StudentPersonalType,
        parent?: StudentParentType,
        address?: StudentAddressType,
        program?: StudentProgramType,
        origin?: StudentOriginType,
        file?: StudentFileType,
        verification?: StudentVerificationType,
    }>();
    const [genderSelected, setGenderSelected] = useState<number | undefined>(0);
    const [statusSelected, setStatusSelected] = useState<number | undefined>(0);
    const [programOptions, setProgramOptions] = useState<OptionsType[]>();
    const [programSelected, setProgramSelected] = useState<number | undefined>(0);
    const [boardingOptions, setBoardingOptions] = useState<OptionsType[]>();
    const [boardingSelected, setBoardingSelected] = useState<number | undefined>(0);
    const identityPage = useRef<HTMLDivElement>(null);
    const hasMounted = useRef(false);

    // -----------------------------------------------------------------------
    // handleSendWa — di-extract agar bisa dimasukkan ke useMemo Column
    // -----------------------------------------------------------------------
    const handleSendWa = useCallback(async (userId: number | string) => {
        setSendingWa(userId);
        try {
            const resp = await sendWhatsAppRegistrationProof(userId);
            if (resp.status === 'success') {
                toast.success(resp.statusMessage || "WhatsApp berhasil dikirim");
            } else {
                toast.error(resp.statusMessage || "Gagal mengirim WhatsApp");
            }
        } catch (err: any) {
            toast.error(err.message || "Terjadi kesalahan");
        } finally {
            setSendingWa(null);
        }
    }, []);

    const handlePrintIdentity = useReactToPrint({
        contentRef: identityPage,
    });

    const handlePrint = useCallback(async (userId: number | undefined) => {
        if (!userId) return;
        setLoading(userId)
        try {
            const personal = await getPersonal({ userId: userId }).then((resp) => {
                if (resp.length > 0) return resp[0];
            });
            const parent = await getParent({ userId: userId }).then((resp) => {
                if (resp.length > 0) return resp[0];
            })
            const address = await getAddress({ userId: userId }).then((resp) => {
                if (resp.length > 0) return resp[0];
            });
            const program = await getProgram({ userId: userId, with: ['program', 'boarding', 'room'] }).then((resp) => {
                if (resp.length > 0) return resp[0];
            })
            const origin = await getOrigin({ userId: userId }).then((resp) => {
                if (resp.length > 0) return resp[0];
            })
            const file = await getFile({ userId: userId }).then((resp) => {
                if (resp.length > 0) return resp[0];
            })
            const verification = await getVerification({ userId: userId }).then((resp) => {
                if (resp.length > 0) return resp[0];
            })
            setData({ personal, parent, address, program, origin, file, verification });

            setTimeout(() => {
                handlePrintIdentity();
                setLoading(null);
            }, 500);
        } catch (error) {
            console.error(error);
            setLoading(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // -----------------------------------------------------------------------
    // Column — di-memoize agar reference tidak berubah saat isOpen toggle,
    // sehingga pagination tidak reset ke halaman 1.
    // -----------------------------------------------------------------------
    const Column = useMemo<ColumnType<StudentOperatorType>[]>(() => [
        {
            name: "Nomor",
            selector: (row) => row.number_register,
            sortable: true,
            width: "130px"
        },
        {
            name: "Nama",
            selector: (row) => row?.name,
            sortable: true,
            width: "350px"
        },
        {
            name: "Tempat, Tanggal Lahir",
            selector: (row) => row?.birthPlace + ', ' + moment(row?.birthDate, 'YYYY-MM-DD').format('DD MMMM YYYY'),
            sortable: false,
            width: "250px"
        },
        {
            name: "Jenis Kelamin",
            selector: (row) => getGender(row.gender),
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
            sortable: true,
        },
        {
            name: "Boarding",
            selector: (row) => row?.boarding,
            sortable: true,
        },
        {
            name: "Status",
            selector: (row) => row?.verification?.id,
            sortable: false,
            width: "100px",
            cell: (row) => {
                if (row.status === 2) {
                    return <Icon name="stop-circle-fill" className="text-danger fs-20px" />
                } else {
                    if (row?.verification !== null && row?.guardName !== "-") {
                        return <Icon name="checkbox-checked" className="text-success fs-20px" />
                    } else {
                        return <Icon name="alert-circle-fill" className="text-warning fs-20px" />
                    }
                }
            },
        },
        {
            name: "",
            selector: (row) => row?.id,
            sortable: false,
            width: "80px",
            cell: (row) => (
                <ActionCell
                    row={row}
                    loading={loading}
                    sendingWa={sendingWa}
                    onPrint={handlePrint}
                    onNavigate={navigate}
                    onSendWa={handleSendWa}
                />
            ),
        },
    ], [loading, sendingWa, handlePrint, handleSendWa, navigate]);

    const handleSendBuckWA = async () => {
        if (students.length === 0) return;
        setSendingBuckWa(true);

        try {
            for (let i = 0; i < students.length; i++) {
                const student = students[i];
                await sendWhatsAppRegistrationProof(student.userId as string | number);

                if (i < students.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
            alert("Semua pesan berhasil dikirim!");
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            alert("Terjadi kesalahan saat mengirim pesan.");
        } finally {
            setSendingBuckWa(false);
        }
    }

    const params = useCallback(() => {
        let p: any = {
            yearId: year?.id,
            institutionId: institution?.id
        }
        if (genderSelected !== 0) p = { ...p, gender: genderSelected }
        if (programSelected !== 0) p = { ...p, programId: programSelected }
        if (boardingSelected !== 0) p = { ...p, boardingId: boardingSelected }
        if (statusSelected !== 0) p = { ...p, status: statusSelected }
        return p;
    }, [year, institution, genderSelected, programSelected, boardingSelected, statusSelected])

    // Fetch options on mount
    useEffect(() => {
        getPrograms<OptionsType>({ type: 'select', year: year?.id, institutionId: institution?.id }).then((resp) => {
            setProgramOptions([{ value: 0, label: "Semua" }, ...resp])
        })
        getBoarding<OptionsType>({ type: 'select' }).then((resp) => {
            setBoardingOptions([{ value: 0, label: "Semua" }, ...resp])
        })
    }, []);

    // Refetch when filters change (skip first mount — initial fetch is below)
    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }
        setLoadData(true);
        studentTreasurer<StudentOperatorType>(params())
            .then((resp) => setStudents(resp))
            .finally(() => setLoadData(false));
    }, [genderSelected, programSelected, boardingSelected, statusSelected]);

    // Initial data fetch on mount
    useEffect(() => {
        studentTreasurer<StudentOperatorType>(params())
            .then((resp) => setStudents(resp))
            .finally(() => setLoadData(false));
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
                                            <li>
                                                <Button
                                                    color="success"
                                                    size="sm"
                                                    outline
                                                    className="btn-white"
                                                    disabled={sendingBuckWa}
                                                    onClick={() => handleSendBuckWA()}
                                                >
                                                    {sendingBuckWa ? <Spinner size="sm" /> : <Icon name="whatsapp" />}
                                                    <span>KIRIM SEMUA</span>
                                                </Button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </BlockHeadContent>
                        </BlockBetween>
                    </BlockHead>
                    <PreviewCard>
                        <Row className="gy-0">
                            <Col sm={3}>
                                <FormGroup>
                                    <Label>Jenis Kelamin</Label>
                                    <RSelect
                                        options={[{ value: 0, label: "Semua" }, ...GENDER_OPTIONS]}
                                        value={GENDER_OPTIONS.find(opt => opt.value === genderSelected) || { value: 0, label: "Semua" }}
                                        onChange={(opt) => {
                                            setGenderSelected(opt?.value || 0)
                                        }}
                                        placeholder="Pilih Jenis Kelamin"
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm={3}>
                                <FormGroup>
                                    <Label>Program Madrasah</Label>
                                    <RSelect
                                        options={programOptions}
                                        value={programOptions?.find(opt => opt.value === programSelected)}
                                        onChange={(opt) => {
                                            setProgramSelected(opt?.value)
                                        }}
                                        placeholder="Pilih Program Madrasah"
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm={3}>
                                <FormGroup>
                                    <Label>Program Pondok</Label>
                                    <RSelect
                                        options={boardingOptions}
                                        value={boardingOptions?.find(opt => opt.value === boardingSelected)}
                                        onChange={(opt) => {
                                            setBoardingSelected(opt?.value)
                                        }}
                                        placeholder="Pilih Program Pondok"
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm={3}>
                                <FormGroup>
                                    <Label>Status</Label>
                                    <RSelect
                                        options={[{ value: 0, label: "Semua" }, ...STUDENT_STATUS]}
                                        value={STUDENT_STATUS?.find(opt => opt.value === statusSelected)}
                                        onChange={(opt) => {
                                            setStatusSelected(opt?.value)
                                        }}
                                        placeholder="Pilih Status"
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <ReactDataTable data={students} columns={Column} pagination progressPending={loadData} />
                    </PreviewCard>
                    <div className="d-flex justify-content-center">
                        <RegistrationProof
                            ref={identityPage}
                            data={data}
                            institution={institution}
                            year={year}
                        />
                    </div>
                </Block>
            </Content>
        </React.Fragment>
    )
}

export default StudentOperator;