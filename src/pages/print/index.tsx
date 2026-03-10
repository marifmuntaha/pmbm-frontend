import React, { useEffect, useRef, useState } from "react";
import Head from "@/layout/head";
import Content from "@/layout/content";
import {
    Block,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Button, Col,
    Icon,
    PreviewCard,
    Row
} from "@/components";
import { useAuthContext } from "@/common/hooks/useAuthContext";
import { show as showInstitution } from "@/common/api/institution";
import { get as getPersonal } from "@/common/api/student/personal";
import { get as getParent } from "@/common/api/student/parent";
import { get as getAddress } from "@/common/api/student/address";
import { get as getProgram } from "@/common/api/student/program";
import { get as getOrigin } from "@/common/api/student/origin";
import { get as getFile } from "@/common/api/student/file";
import { downloadRegistrationProof } from "@/common/api/student/registration";
import { downloadAllReceipts } from "@/common/api/payment/receipt";
import { get as getVerification } from "@/common/api/student/verivication";
import type {
    InstitutionType,
    StudentAddressType, StudentFileType, StudentOriginType,
    StudentParentType,
    StudentPersonalType,
    StudentProgramType,
    StudentVerificationType
} from "@/types";
import { useReactToPrint } from "react-to-print";
import { useYearContext } from "@/common/hooks/useYearContext";
import { toast } from "react-toastify";
import RegistrationProof from "./components/RegistrationProof";
import ControlCard from "./components/ControlCard";

const Print = () => {
    const { user } = useAuthContext();
    const year = useYearContext();
    const identityPage = useRef<HTMLDivElement>(null);
    const [data, setData] = useState<{
        personal?: StudentPersonalType,
        parent?: StudentParentType,
        address?: StudentAddressType,
        program?: StudentProgramType,
        origin?: StudentOriginType,
        file?: StudentFileType,
        verification?: StudentVerificationType,
    }>();
    const [institution, setInstitution] = useState<InstitutionType>();
    const [isDownloading, setIsDownloading] = useState(false);
    const [isDownloadingReceipt, setIsDownloadingReceipt] = useState(false);

    const handlePrintIdentity = useReactToPrint({
        contentRef: identityPage,
    });

    const handleDownloadRegistrationProof = async () => {
        if (!data?.verification) {
            toast.error('Bukti pendaftaran belum lengkap/belum siap di cetak. Mohon lengkapi pendaftaran.');
            return;
        }
        setIsDownloading(true);
        try {
            await downloadRegistrationProof();
            toast.success('Bukti pendaftaran berhasil diunduh');
        } catch (error: any) {
            toast.error(error.message || 'Gagal mengunduh bukti pendaftaran');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDownloadReceipt = async () => {
        setIsDownloadingReceipt(true);
        try {
            const blob = await downloadAllReceipts(window.location.origin);

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `semua-kuitansi-pembayaran.pdf`;
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success('Bukti pembayaran berhasil diunduh');
        } catch (error: any) {
            toast.error(error.message || 'Gagal mengunduh bukti pembayaran');
        } finally {
            setIsDownloadingReceipt(false);
        }
    };

    useEffect(() => {
        user?.institutionId && showInstitution({ id: user.institutionId }).then((resp) => setInstitution(resp));
        const getData = async () => {
            const personal = await getPersonal({ userId: user?.id }).then((resp) => {
                if (resp.length > 0) return resp[0];
            });
            const parent = await getParent({ userId: user?.id }).then((resp) => {
                if (resp.length > 0) return resp[0];
            })
            const address = await getAddress({ userId: user?.id }).then((resp) => {
                if (resp.length > 0) return resp[0];
            });
            const program = await getProgram({ userId: user?.id, with: ['program', 'boarding', 'room'] }).then((resp) => {
                if (resp.length > 0) return resp[0];
            })
            const origin = await getOrigin({ userId: user?.id }).then((resp) => {
                if (resp.length > 0) return resp[0];
            })
            const file = await getFile({ userId: user?.id }).then((resp) => {
                if (resp.length > 0) return resp[0];
            })
            const verification = await getVerification({ userId: user?.id }).then((resp) => {
                if (resp.length > 0) return resp[0];
            })
            setData({ ...data, personal: personal, parent: parent, address: address, program: program, origin: origin, file: file, verification: verification });
        }
        getData();
    }, []);

    const controlCardPage = useRef<HTMLDivElement>(null);

    const handlePrintControlCard = useReactToPrint({
        contentRef: controlCardPage,
    });

    return (
        <React.Fragment>
            <Head title="Cetak Kartu" />
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockHeadContent className="text-center mb-5">
                            <BlockTitle tag="h2" className="fw-bold text-primary mb-3">Cetak Dokumen Pendaftaran</BlockTitle>
                            <div className="d-flex justify-content-center">
                                <p className="text-muted fs-16px w-75 lg-w-50">
                                    Selamat! Data pendaftaran Anda telah berhasil diproses.
                                    Silakan unduh atau cetak dokumen administrasi di bawah ini untuk keperluan verifikasi lapangan.
                                </p>
                            </div>
                        </BlockHeadContent>
                    </BlockHead>
                </Block>

                <Block>
                    <Row className="gy-4 justify-center">
                        {/* Action Card 1: Bukti Pendaftaran PDF */}
                        <Col lg={3} md={6}>
                            <PreviewCard className="h-100 border-0 shadow-sm hover-shadow-lg transition-all border-top border-4 border-success">
                                <div className="card-inner p-4 text-center d-flex flex-column h-100">
                                    <div className="mb-4 mt-2">
                                        <div className="d-inline-flex align-items-center justify-content-center bg-success-dim rounded-circle" style={{ width: '80px', height: '80px' }}>
                                            <Icon name="file-docs" className="fs-1 text-success" />
                                        </div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h4 className="title mb-3">Bukti Pendaftaran</h4>
                                        <p className="text-soft mb-4 px-1 fs-13px">Silahkan unduh bukti pendaftaran untuk keperluan verifikasi lapangan.</p>
                                    </div>
                                    <Button
                                        className="btn-round btn-lg btn-success w-100 py-3 mt-auto shadow-sm"
                                        onClick={handleDownloadRegistrationProof}
                                        disabled={isDownloading}
                                    >
                                        {isDownloading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                <span>Mengunduh...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Icon name="download-cloud" className="me-2" />
                                                <span>Bukti Pendaftaran</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </PreviewCard>
                        </Col>

                        {/* Action Card 2: Bukti Pembayaran PDF */}
                        <Col lg={3} md={6}>
                            <PreviewCard className="h-100 border-0 shadow-sm hover-shadow-lg transition-all border-top border-4 border-info">
                                <div className="card-inner p-4 text-center d-flex flex-column h-100">
                                    <div className="mb-4 mt-2">
                                        <div className="d-inline-flex align-items-center justify-content-center bg-info-dim rounded-circle" style={{ width: '80px', height: '80px' }}>
                                            <Icon name="money" className="fs-1 text-info" />
                                        </div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h4 className="title mb-3">Bukti Pembayaran</h4>
                                        <p className="text-soft mb-4 px-1 fs-13px">Silahkan unduh bukti pembayaran sebagai bukti pelunasan.</p>
                                    </div>
                                    <Button
                                        className="btn-round btn-lg btn-info w-100 py-3 mt-auto shadow-sm text-white"
                                        onClick={handleDownloadReceipt}
                                        disabled={isDownloadingReceipt}
                                    >
                                        {isDownloadingReceipt ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                <span>Mengunduh...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Icon name="download-cloud" className="me-2" />
                                                <span>Unduh Kuitansi</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </PreviewCard>
                        </Col>

                        {/* Action Card 3: Identitas Pendaftar */}
                        <Col lg={3} md={6}>
                            <PreviewCard className="h-100 border-0 shadow-sm hover-shadow-lg transition-all border-top border-4 border-primary">
                                <div className="card-inner p-4 text-center d-flex flex-column h-100">
                                    <div className="mb-4 mt-2">
                                        <div className="d-inline-flex align-items-center justify-content-center bg-primary-dim rounded-circle" style={{ width: '80px', height: '80px' }}>
                                            <Icon name="user-check" className="fs-1 text-primary" />
                                        </div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h4 className="title mb-3">Identitas Lengkap</h4>
                                        <p className="text-soft mb-4 px-1 fs-13px">Cetak identitas lengkap pendaftar yang berisi rincian data pendaftar.</p>
                                    </div>
                                    <Button
                                        className="btn-round btn-lg btn-primary w-100 py-3 mt-auto shadow-sm"
                                        onClick={() => handlePrintIdentity()}
                                    >
                                        <Icon name="printer" className="me-2" />
                                        <span>Cetak Formulir</span>
                                    </Button>
                                </div>
                            </PreviewCard>
                        </Col>

                        {/* Action Card 4: Kartu Kendali */}
                        <Col lg={3} md={6}>
                            <PreviewCard className="h-100 border-0 shadow-sm hover-shadow-lg transition-all border-top border-4 border-warning">
                                <div className="card-inner p-4 text-center d-flex flex-column h-100">
                                    <div className="mb-4 mt-2">
                                        <div className="d-inline-flex align-items-center justify-content-center bg-warning-dim rounded-circle" style={{ width: '80px', height: '80px' }}>
                                            <Icon name="list-check" className="fs-1 text-warning" />
                                        </div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h4 className="title mb-3">Kartu Kendali</h4>
                                        <p className="text-soft mb-4 px-1 fs-13px">Cetak kartu kendali untuk kelengkapan berkas saat verifikasi daftar ulang.</p>
                                    </div>
                                    <Button
                                        className="btn-round btn-lg btn-warning w-100 py-3 mt-auto shadow-sm text-white"
                                        onClick={() => handlePrintControlCard()}
                                    >
                                        <Icon name="printer" className="me-2" />
                                        <span>Cetak Kartu</span>
                                    </Button>
                                </div>
                            </PreviewCard>
                        </Col>
                    </Row>
                </Block>
                <Block className="justify-center">
                    <div className="d-flex justify-content-center">
                        <RegistrationProof
                            ref={identityPage}
                            data={data}
                            institution={institution}
                            year={year}
                        />
                    </div>
                    <div style={{ display: 'none' }}>
                        <ControlCard
                            ref={controlCardPage}
                            data={data}
                            institution={institution}
                            year={year}
                        />
                    </div>
                </Block>
            </Content>
        </React.Fragment>
    );
};

export default Print;
