import React, {useEffect, useRef, useState} from "react";
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
import type {
    ColumnType,
    StudentAddressType, StudentFileType,
    StudentOperatorType, StudentOriginType,
    StudentParentType,
    StudentPersonalType, StudentProgramType, StudentVerificationType
} from "@/types";
import { studentTreasurer } from "@/common/api/student";
import { sendWhatsAppRegistrationProof } from "@/common/api/student/registration";
import moment from "moment/moment";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Spinner } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RegistrationProof from "@/pages/print/components/RegistrationProof";
import {get as getPersonal} from "@/common/api/student/personal";
import {get as getParent} from "@/common/api/student/parent";
import {get as getAddress} from "@/common/api/student/address";
import {get as getProgram} from "@/common/api/student/program";
import {get as getOrigin} from "@/common/api/student/origin";
import {get as getFile} from "@/common/api/student/file";
import {get as getVerification} from "@/common/api/student/verivication";
import {useReactToPrint} from "react-to-print";
import {getGender} from "@/helpers";

const StudentOperator = () => {
    const year = useYearContext()
    const institution = useInstitutionContext()
    const navigate = useNavigate()
    const [sm, updateSm] = useState(false)
    const [sendingWa, setSendingWa] = useState<number | string | null>(null)
    const [sendingBuckWa, setSendingBuckWa] = useState(false)
    const [loading, setLoading] = useState(false);
    const [loadData, setLoadData] = useState(true)
    const [students, setStudents] = useState<StudentOperatorType[]>([])
    const [isOpen, setIsOpen] = useState<number | null>(null);
    const [data, setData] = useState<{
        personal?: StudentPersonalType,
        parent?: StudentParentType,
        address?: StudentAddressType,
        program?: StudentProgramType,
        origin?: StudentOriginType,
        file?: StudentFileType,
        verification?: StudentVerificationType,
    }>();
    const identityPage = useRef<HTMLDivElement>(null);
    const Column: ColumnType<StudentOperatorType>[] = [
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
                    return <Icon name="stop-circle-fill" className="text-danger fs-20px"/>
                } else {
                    if (row?.verification !== null && row?.guardName !== "-") {
                        return <Icon name="checkbox-checked" className="text-success fs-20px"/>
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
            right: true,
            cell: (row) => (
                <Dropdown isOpen={isOpen === row.id} toggle={() => setIsOpen(isOpen === row.id ? null : row.id ?? null)}>
                    <DropdownToggle className="btn-action" color="light" size="xs">
                        <Icon name="more-h" />
                    </DropdownToggle>
                    <DropdownMenu>
                        <ul className="link-list-opt">
                            <li>
                                <DropdownItem tag="a" href="#links" onClick={() => {
                                    handlePrint(row.userId).finally(() => handlePrintIdentity())
                                }}>
                                    {loading ? <Spinner size="sm" /> :  <Icon name="printer" color="info"/>}<span>Cetak Formulir</span>
                                </DropdownItem>
                            </li>
                            <li>
                                <DropdownItem tag="a" href="#links" onClick={() => navigate(`/data-pendaftar/${row.userId}/ubah`)}>
                                    <Icon name="pen" /><span>Ubah/Perbarui</span>
                                </DropdownItem>
                            </li>
                            <li>
                                <DropdownItem tag="a" href="#links" onClick={async () => {
                                    setSendingWa(row.userId as string | number);
                                    try {
                                        const resp = await sendWhatsAppRegistrationProof(row.userId as string | number);
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

                                }}>
                                    {sendingWa ? <Spinner size="sm" /> : <Icon name="whatsapp" />} <span>Kirim Notifikasi</span>
                                </DropdownItem>
                            </li>
                        </ul>
                    </DropdownMenu>
                </Dropdown>
            ),
        },
    ];
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
    const handlePrint = async (userId: number|undefined)=> {
        setLoading(true)
        const getData = async () => {
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
            setData({ ...data, personal: personal, parent: parent, address: address, program: program, origin: origin, file: file, verification: verification });
        }
        getData().finally(() => {
            setLoading(false);
        });
    }
    const handlePrintIdentity = useReactToPrint({
        contentRef: identityPage,
    });

    useEffect(() => {
        studentTreasurer<StudentOperatorType>({ yearId: year?.id, institutionId: institution?.id })
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