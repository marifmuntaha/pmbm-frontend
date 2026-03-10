import React, { useEffect, useState } from "react";
import Head from "@/layout/head";
import Content from "@/layout/content";
import { PreviewCard, Row, Col, Icon } from "@/components";
import { useAuthContext } from "@/common/hooks/useAuthContext";
import { formatIDR, getRoleName } from "@/helpers";
import { Card, CardBody, CardHeader, CardText } from "reactstrap";
import { studentDashboard } from "@/common/api/student";
import type {
    StudentDashboardType,
} from "@/types";
import { useNavigate } from "react-router-dom";
import type { AnnouncementType } from "@/types";
import AnnouncementWidget from "@/components/AnnouncementWidget";

const Student = () => {
    const { user } = useAuthContext()
    const [student, setStudent] = useState<StudentDashboardType>()
    const navigate = useNavigate()
    useEffect(() => {
        studentDashboard({ userId: user?.id }).then((resp) => {
            if (resp) setStudent(resp)
        })
    }, [])

    return (
        <React.Fragment>
            <Head title="Dashboard" />
            <Content>
                {/* Desktop View */}
                <div className="d-none d-md-block">
                    <Row className="gy-3">
                        <Col md={12} className="mb-3">
                            <div className="p-4 p-md-5 mb-3 rounded-4 text-white bg-blue bg-gradient shadow-sm position-relative overflow-hidden">
                                <div className="position-relative z-1">
                                    <h1 className="display-6 fw-bold mb-2">Selamat Datang, {user?.name}! 👋</h1>
                                    <p className="col-md-8 fs-5 opacity-75">
                                        Anda masuk sebagai <span className="badge bg-light text-primary fw-bold text-uppercase ms-1">{getRoleName(user?.role)}</span><br />
                                    </p>
                                </div>
                            </div>
                        </Col>
                        <Col md={12} className="mb-4">
                            <Card className="card-bordered shadow-sm rounded-4 border-0 h-100">
                                <CardBody className="card-inner p-4">
                                    <div className="d-flex align-items-start">
                                        <div className="flex-shrink-0 me-3 text-info">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
                                                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                                            </svg>
                                        </div>
                                        <div className="flex-grow-1">
                                            <h5 className="fw-bold text-dark mb-2">Informasi Pendaftaran</h5>
                                            <CardText className="text-secondary lh-lg">
                                                Aplikasi Penerimaan Siswa Baru Yayasan Darul Hikmah Menganti mempermudah proses
                                                pendaftaran siswa baru secara online. Penuhi kelengkapan berkas dan pantau status pendaftaran Anda secara berkala melalui timeline di bawah ini.
                                            </CardText>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <CardHeader className="bg-white border-bottom p-4">
                                <h5 className="fw-bold mb-0">Status Pendaftaran</h5>
                            </CardHeader>
                            <PreviewCard>
                                <div className="card-inner">
                                    <div className="timeline">
                                        <ul className="timeline-list">
                                            <li className="timeline-item">
                                                <div className={`timeline-status ${student?.personal?.updated_at ? 'bg-success is-outline' : 'bg-danger'} me-2`}></div>
                                                <div className="timeline-data">
                                                    <h6 className="timeline-title">Input Data Pribadi</h6>
                                                    <div className="timeline-des">
                                                        <p className="text-muted ff-italic">
                                                            Terakhir diperbarui : {student?.personal ? student.personal.updated_at : '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="timeline-item">
                                                <div className={`timeline-status ${student?.parent?.updated_at ? 'bg-success is-outline' : 'bg-danger'} me-2`}></div>
                                                <div className="timeline-data">
                                                    <h6 className="timeline-title">Input Data Orangtua/Wali</h6>
                                                    <div className="timeline-des">
                                                        <p className="text-muted ff-italic">
                                                            Terakhir diperbarui : {student?.parent ? student.parent.updated_at : '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="timeline-item">
                                                <div className={`timeline-status ${student?.address?.updated_at ? 'bg-success is-outline' : 'bg-danger'} me-2`}></div>
                                                <div className="timeline-data">
                                                    <h6 className="timeline-title">Input Data Tempat Tinggal</h6>
                                                    <div className="timeline-des">
                                                        <p className="text-muted ff-italic">
                                                            Terakhir diperbarui : {student?.address?.updated_at ? student?.address.updated_at : '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="timeline-item">
                                                <div className={`timeline-status ${student?.program?.updated_at ? 'bg-success is-outline' : 'bg-danger'} me-2`}></div>
                                                <div className="timeline-data">
                                                    <h6 className="timeline-title">Input Program Pilihan</h6>
                                                    <div className="timeline-des">
                                                        <p className="text-muted ff-italic">
                                                            Terakhir diperbarui : {student?.program?.updated_at ? student?.program.updated_at : '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="timeline-item">
                                                <div className={`timeline-status ${student?.origin?.updated_at ? 'bg-success is-outline' : 'bg-danger'} me-2`}></div>
                                                <div className="timeline-data">
                                                    <h6 className="timeline-title">Input Sekolah Asal</h6>
                                                    <div className="timeline-des">
                                                        <p className="text-muted ff-italic">
                                                            Terakhir diperbarui : {student?.origin?.updated_at ? student?.origin.updated_at : '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="timeline-item">
                                                <div className={`timeline-status ${student?.files?.updated_at ? 'bg-success is-outline' : 'bg-danger'} me-2`}></div>
                                                <div className="timeline-data">
                                                    <h6 className="timeline-title">Unggah Berkas</h6>
                                                    <div className="timeline-des">
                                                        <p className="text-muted ff-italic">
                                                            Terakhir diperbarui : {student?.files?.updated_at ? student?.files.updated_at : '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </PreviewCard>
                        </Col>
                        <Col md={6}>
                            <Row className="gy-4">
                                <Col md={6}>
                                    <Card className="border-0 shadow-sm rounded-4 bg-success bg-opacity-10 h-100 position-relative overflow-hidden">
                                        <CardBody className="p-4 d-flex flex-column justify-content-center position-relative z-1">
                                            <h6 className="text-uppercase text-muted fw-bold small ls-1 mb-1">Total Pendaftar</h6>
                                            <h3 className="fw-bold text-success mb-0">{student?.totalStudent} <span className="fs-6 fw-normal text-muted">Peserta</span></h3>
                                        </CardBody>
                                        <div className="position-absolute bottom-0 end-0 opacity-10 p-3">
                                            <i className="ni ni-users display-1 text-success"></i>
                                        </div>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card className="border-0 shadow-sm rounded-4 bg-danger bg-opacity-10 h-100 position-relative overflow-hidden">
                                        <CardBody className="p-4 d-flex flex-column justify-content-center position-relative z-1">
                                            <h6 className="text-uppercase text-muted fw-bold small ls-1 mb-1">Tagihan</h6>
                                            <h3 className="fw-bold text-danger mb-0">{formatIDR(student?.totalInvoice)}</h3>
                                        </CardBody>
                                        <div className="position-absolute bottom-0 end-0 opacity-10 p-3">
                                            <i className="ni ni-money display-1 text-danger"></i>
                                        </div>
                                    </Card>
                                </Col>
                                <Col md={12}>
                                    <AnnouncementWidget announcements={student?.announcements as AnnouncementType[]} />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>

                {/* Mobile View */}
                <div className="d-block d-md-none">
                    <div className="p-4 mb-4 rounded-4 text-white bg-blue bg-gradient shadow-sm position-relative overflow-hidden">
                        <div className="position-relative z-1">
                            <h4 className="fw-bold mb-1">Halo, {user?.name}! 👋</h4>
                            <p className="opacity-75 small mb-0">Selamat datang di Panel Pendaftaran</p>
                        </div>
                    </div>
                    <Row className="g-3">
                        <Col size={6}>
                            <Card className="border-0 shadow-sm rounded-4 h-100 text-center cursor-pointer" onClick={() => navigate('/pendaftaran/data-pribadi')}>
                                <CardBody className="py-4 px-2">
                                    <div className="mb-2">
                                        <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block">
                                            <Icon name="file-text" className="fs-2 text-primary" />
                                        </div>
                                    </div>
                                    <span className="fw-bold small d-block lh-sm text-dark">Lengkapi Pendaftaran</span>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col size={6}>
                            <Card className="border-0 shadow-sm rounded-4 h-100 text-center cursor-pointer" onClick={() => navigate('/pembayaran')}>
                                <CardBody className="py-4 px-2">
                                    <div className="mb-2">
                                        <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block">
                                            <Icon name="cc-alt" className="fs-2 text-success" />
                                        </div>
                                    </div>
                                    <span className="fw-bold small d-block lh-sm text-dark">Pembayaran</span>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col size={6}>
                            <Card className="border-0 shadow-sm rounded-4 h-100 text-center cursor-pointer" onClick={() => navigate('/cetak-kartu')}>
                                <CardBody className="py-4 px-2">
                                    <div className="mb-2">
                                        <div className="bg-info bg-opacity-10 p-3 rounded-circle d-inline-block">
                                            <Icon name="printer" className="fs-2 text-info" />
                                        </div>
                                    </div>
                                    <span className="fw-bold small d-block lh-sm text-dark">Cetak Kartu</span>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col size={6}>
                            <Card className="border-0 shadow-sm rounded-4 h-100 text-center cursor-pointer" onClick={() => navigate('/auth/keluar')}>
                                <CardBody className="py-4 px-2">
                                    <div className="mb-2">
                                        <div className="bg-danger bg-opacity-10 p-3 rounded-circle d-inline-block">
                                            <Icon name="signout" className="fs-2 text-danger" />
                                        </div>
                                    </div>
                                    <span className="fw-bold small d-block lh-sm text-danger">Keluar</span>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Content>
        </React.Fragment>
    )
}

export default Student