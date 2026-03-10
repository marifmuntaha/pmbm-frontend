import React, { useEffect, useState } from "react";
import Head from "@/layout/head";
import Content from "@/layout/content";
import moment from "moment";
import 'moment/locale/id';
import { Col, Icon, PreviewCard, Row, Button, AdministratorSkeleton, BlockTitle, BlockHead, Block, BlockHeadContent } from "@/components";
import { Badge, Card, Table } from "reactstrap";
import { useAuthContext } from "@/common/hooks/useAuthContext";
import { useYearContext } from "@/common/hooks/useYearContext";
import { Link } from "react-router-dom";
import { getRoleName, formatIDR } from "@/helpers";
import { getDashboardStats, updateSystem, type AdminDashboardStats } from "@/common/api/administrator";
import { Modal, ModalBody, Spinner } from "reactstrap";
import Swal from "sweetalert2";

moment.locale('id');

const Administrator = () => {
    const year = useYearContext();
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [data, setData] = useState<AdminDashboardStats | null>(null);

    const handleSystemUpdate = () => {
        Swal.fire({
            title: "Perbarui Sistem?",
            text: "Ini akan menarik kode terbaru dari GitHub dan merakit ulang (Build) aplikasi frontend. Pastikan tidak ada orang lain yang sedang bertransaksi. Proses ini memakan waktu kurang lebih 30-60 detik.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Mulai Update",
            cancelButtonText: "Batal",
        }).then((result: any) => {
            if (result.isConfirmed) {
                setIsUpdating(true);
                updateSystem().then((res) => {
                    if (res && res.log) {
                        Swal.fire({
                            title: "Berhasil!",
                            text: "Sistem telah diperbarui. Harap segarkan (Reload) halaman browser Anda.",
                            icon: "success",
                            confirmButtonText: "Muat Ulang Sekarang"
                        }).then(() => {
                            window.location.reload();
                        });
                    }
                }).catch(() => {
                    Swal.fire("Gagal", "Terjadi kesalahan saat memperbarui sistem.", "error");
                }).finally(() => {
                    setIsUpdating(false);
                });
            }
        });
    }

    useEffect(() => {
        if (year?.id) {
            setLoading(true);
            getDashboardStats({
                yearId: `${year.id}`
            })
                .then((resp) => {
                    setData(resp);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [year]);
    if (loading) return <AdministratorSkeleton />
    return (
        <React.Fragment>
            <Head title="Dashboard" />
            <Content>
                <Row className="gy-4">
                    <Col md={12}>
                        <PreviewCard className="bg-primary-dim border-primary">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <Icon name="monitor-fill" className="text-primary fs-1 me-3" />
                                    <div>
                                        <h4 className="title text-primary mb-1">Dashboard Administrator</h4>
                                        <p className="text-soft">
                                            Selamat datang, <strong>{user?.name}</strong> ({getRoleName(user?.role)})<br />
                                            Tahun Ajaran: <strong>{year?.name}</strong> | Mode: <strong>Global View</strong>
                                        </p>
                                    </div>
                                </div>
                                <div className="d-none d-md-block">
                                    <Button color="danger" className="btn-dim me-2" onClick={handleSystemUpdate}>
                                        <Icon name="update" /> <span>Update Sistem</span>
                                    </Button>
                                    <Link to="/data-pengguna">
                                        <Button color="primary" className="btn-dim">
                                            <Icon name="users-fill" /> <span>Kelola Pengguna</span>
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </PreviewCard>

                        {/* Modal Loading Update */}
                        <Modal isOpen={isUpdating} backdrop="static" keyboard={false} centered>
                            <ModalBody className="text-center py-5">
                                <Spinner color="danger" style={{ width: '3rem', height: '3rem' }} />
                                <h5 className="mt-4">Memperbarui Sistem...</h5>
                                <p className="text-soft">
                                    Mohon jangan tutup halaman ini.<br />
                                    Sistem sedang mengambil kode sumber terbaru dan mengkompilasi file statis.
                                    Ini dapat memakan waktu hingga satu menit.
                                </p>
                            </ModalBody>
                        </Modal>
                    </Col>
                    {data && (
                        <React.Fragment>
                            <Col md={12} className="mt-4">
                                <h5 className="title">Statistik Siswa</h5>
                            </Col>
                            <Col md={6}>
                                <Card className="card-bordered border-primary h-100">
                                    <div className="card-inner p-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6 className="title text-primary fs-13px mb-0">TOTAL PENDAFTAR (GLOBAL)</h6>
                                            <Icon name="users-fill" className="text-primary" />
                                        </div>
                                        <div className="d-flex align-items-baseline mb-3">
                                            <h3 className="amount text-primary mb-0 me-2">{data.totalStudents}</h3>
                                            <span className="text-muted small">Siswa</span>
                                        </div>
                                        <div className="row g-2 border-top pt-2 mt-auto">
                                            <div className="col-6 border-end">
                                                <div className="d-flex align-items-center">
                                                    <div className="dot dot-success me-2"></div>
                                                    <div>
                                                        <span className="d-block fw-bold text-dark fs-12px">{data.totalVerified}</span>
                                                        <span className="d-block overly-small text-soft">Terverifikasi</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-6 ps-3">
                                                <div className="d-flex align-items-center">
                                                    <div className="dot dot-warning me-2"></div>
                                                    <div>
                                                        <span className="d-block fw-bold text-dark fs-12px">{data.totalUnverified}</span>
                                                        <span className="d-block overly-small text-soft">Pending</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="card-bordered border-danger h-100">
                                    <div className="card-inner p-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6 className="title text-danger fs-13px mb-0">BOARDING (ASRAMA)</h6>
                                            <Icon name="home-fill" className="text-danger" />
                                        </div>
                                        <div className="d-flex align-items-baseline mb-3">
                                            <h3 className="amount text-danger mb-0 me-2">{data.totalBoarding}</h3>
                                            <span className="text-muted small">Siswa</span>
                                        </div>
                                        <div className="border-top pt-2 mt-auto">
                                            <h6 className="sub-title text-soft overly-small mb-2" style={{ fontSize: '10px' }}>DETAIL ASRAMA</h6>
                                            <div className="row g-1">
                                                {data.boardingBreakdown.map((b, i) => (
                                                    <div className="col-6" key={i}>
                                                        <div className="d-flex justify-content-between align-items-center pe-2">
                                                            <span className="text-soft small" style={{ fontSize: '11px' }}>{b.name}</span>
                                                            <span className="fw-bold text-dark fs-11px">{b.count}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>

                            {data.institutions.map((inst, idx) => (
                                <Col md={3} sm={6} key={`student-${idx}`}>
                                    <Card className="card-bordered h-100">
                                        <div className="card-inner">
                                            <div className="card-title-group align-start mb-2">
                                                <div className="card-title">
                                                    <h6 className="title text-dark">{inst.name}</h6>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-end mt-2">
                                                <div className="text-center">
                                                    <span className="d-block h4 mb-0 text-primary">{inst.totalStudents}</span>
                                                    <span className="small text-soft">Total</span>
                                                </div>
                                                <div className="text-center border-start ps-3">
                                                    <span className="d-block h4 mb-0 text-success">{inst.verified}</span>
                                                    <span className="small text-soft">Oke</span>
                                                </div>
                                                <div className="text-center border-start ps-3">
                                                    <span className="d-block h4 mb-0 text-warning">{inst.unverified}</span>
                                                    <span className="small text-soft">Pending</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                            {/* Institution Breakdown - Financial Stats */}
                            <Col md={12} className="mt-4">
                                <h5 className="title">Statistik Keuangan per Lembaga</h5>
                            </Col>
                            {data.institutions.map((inst, idx) => (
                                <Col md={3} sm={6} key={`finance-${idx}`}>
                                    <Card className="card-bordered h-100 border-info">
                                        <div className="card-inner p-3">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <h6 className="title text-dark mb-0 fs-13px">{inst.name}</h6>
                                                <Icon name="wallet-fill" className="text-info" />
                                            </div>
                                            <div className="d-flex justify-content-between align-items-end">
                                                <div>
                                                    <div className="small text-soft">Tagihan</div>
                                                    <div className="fw-bold text-dark">{formatIDR(inst.totalInvoiced)}</div>
                                                </div>
                                            </div>
                                            <div className="row g-0 mt-2 border-top pt-2">
                                                <div className="col-6 border-end pe-2">
                                                    <div className="overly-small text-success">Terbayar</div>
                                                    <div className="fw-bold fs-13px text-success">{formatIDR(inst.totalPaid)}</div>
                                                </div>
                                                <div className="col-6 ps-2">
                                                    <div className="overly-small text-danger">Kurang</div>
                                                    <div className="fw-bold fs-13px text-danger">{formatIDR(inst.totalUnpaid)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))}

                            {/* Row 4: Recent Tables */}
                            <Col md={6} className="mt-4">
                                <Block size="lg">
                                    <BlockHead>
                                        <BlockHeadContent>
                                            <BlockTitle tag="h6">Pendaftaran Terbaru</BlockTitle>
                                        </BlockHeadContent>
                                    </BlockHead>
                                    <PreviewCard className="h-100">
                                        <div className="table-responsive">
                                            <Table className="table-borderless table-sm table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Nama</th>
                                                        <th>Lembaga</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.recentActivity.map((stu, i) => (
                                                        <tr key={i} className="align-middle">
                                                            <td>
                                                                <span className="fw-medium text-dark d-block fs-12px">{stu.name}</span>
                                                                <span className="small text-soft" style={{ fontSize: '10px' }}>{moment(stu.created_at).format('DD MMM HH:mm')}</span>
                                                            </td>
                                                            <td className="small text-dark fs-12px">{stu.institutionName}</td>
                                                            <td className="text-start">
                                                                <Badge color={stu.verified ? 'success' : 'warning'} className="badge-dot">
                                                                    {stu.verified ? 'Terverifikasi' : 'Pending'}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {data.recentActivity.length === 0 && (
                                                        <tr>
                                                            <td colSpan={3} className="text-center text-soft py-4">Belum ada data</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </PreviewCard>
                                </Block>
                            </Col>
                            <Col md={6} className="mt-4">
                                <Block size="lg">
                                    <BlockHead>
                                        <BlockHeadContent>
                                            <BlockTitle tag="h6">Pembayaran Terbaru</BlockTitle>
                                        </BlockHeadContent>
                                    </BlockHead>
                                    <PreviewCard className="h-100">
                                        <div className="table-responsive">
                                            <Table className="table-borderless table-sm table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Nama</th>
                                                        <th>Lembaga</th>
                                                        <th>Jumlah</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.recentPayments.map((pay, i) => (
                                                        <tr key={i} className="align-middle">
                                                            <td>
                                                                <span className="fw-medium text-dark d-block fs-12px">{pay.studentName}</span>
                                                                <span className="small text-soft" style={{ fontSize: '10px' }}>{moment(pay.date).format('DD MMM HH:mm')}</span>
                                                            </td>
                                                            <td className="small text-dark fs-12px">{pay.institutionName}</td>
                                                            <td className="text-end fw-bold text-success fs-12px">
                                                                {formatIDR(pay.amount)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {data.recentPayments.length === 0 && (
                                                        <tr>
                                                            <td colSpan={3} className="text-center text-soft py-4">Belum ada data</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </PreviewCard>
                                </Block>
                            </Col>
                        </React.Fragment>
                    )}
                </Row>
            </Content>
        </React.Fragment>
    );
}

export default Administrator;