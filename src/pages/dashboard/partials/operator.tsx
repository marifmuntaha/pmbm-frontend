import React, { useEffect, useState } from "react";
import Head from "@/layout/head";
import Content from "@/layout/content";
import { Col, Icon, PreviewCard, Row, Button } from "@/components";
import { Badge, Card, Spinner, Table } from "reactstrap";
import { useYearContext } from "@/common/hooks/useYearContext";
import { useInstitutionContext } from "@/common/hooks/useInstitutionContext";
import moment from "moment";
import { Link } from "react-router-dom";
import { apiCore } from "@/common/api/core";
import { getGender } from "@/helpers";

const api = new apiCore();

type OperatorStats = {
    institution: any;
    stats: {
        total: number;
        verified: number;
        unverified: number;
        boarding: number;
        nonBoarding: number;
        programs: Array<{
            name: string;
            alias: string;
            total: number;
        }>;
        out: number;
    };
    recentStudents: any[];
}

const OperatorDashboard = () => {
    const year = useYearContext();
    const institution = useInstitutionContext();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<OperatorStats | null>(null);

    useEffect(() => {
        if (year?.id && institution?.id) {
            api.get<OperatorStats>('/report/operator/stats', {
                yearId: String(year.id),
                institutionId: String(institution.id)
            }, false)
                .then((resp) => {
                    setData(resp.result as OperatorStats);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [year, institution]);

    return (
        <React.Fragment>
            <Head title="Dashboard Operator" />
            <Content>
                <Row className="gy-4">
                    <Col md={12}>
                        <PreviewCard className="bg-info-dim border-info text-dark">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <Icon name="monitor-fill" className="text-info fs-1 me-3" />
                                    <div>
                                        <h4 className="title text-info mb-1">Pusat Kendali Operator</h4>
                                        <p className="text-soft">Madrasah: <strong>{institution?.name}</strong> | TA: <strong>{year?.name}</strong></p>
                                    </div>
                                </div>
                                <div className="d-none d-md-block">
                                    <Link to="/data-pendaftar">
                                        <Button color="info" className="btn-dim">
                                            <Icon name="users-fill" /> <span>Lihat Semua Pendaftar</span>
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </PreviewCard>
                    </Col>

                    {loading ? (
                        <Col md={12} className="text-center py-5">
                            <Spinner color="info" />
                        </Col>
                    ) : (
                        data && (
                            <>
                                <Col md={2}>
                                    <Card className="card-bordered border-primary shadow-sm h-100">
                                        <div className="card-inner">
                                            <div className="card-title-group align-start mb-2">
                                                <div className="card-title">
                                                    <h6 className="title text-soft">TOTAL PENDAFTAR</h6>
                                                </div>
                                                <div className="card-tools">
                                                    <Icon name="users-fill" className="text-primary fs-3" />
                                                </div>
                                            </div>
                                            <div className="data-group align-end flex-wrap g-3 justify-between">
                                                <div className="amount text-primary fs-2">{data.stats.total}</div>
                                                <div className="info text-soft small">Siswa Mendaftar</div>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                                <Col md={2}>
                                    <Card className="card-bordered border-info shadow-sm h-100">
                                        <div className="card-inner">
                                            <div className="card-title-group align-start mb-2">
                                                <div className="card-title">
                                                    <h6 className="title text-soft">SISWA MONDOK</h6>
                                                </div>
                                                <div className="card-tools">
                                                    <Icon name="home-fill" className="text-info fs-3" />
                                                </div>
                                            </div>
                                            <div className="data-group align-end flex-wrap g-3 justify-between">
                                                <div className="amount text-info fs-2">{data.stats.boarding}</div>
                                                <div className="danger text-soft small">Tinggal di Asrama</div>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                                <Col md={2}>
                                    <Card className="card-bordered border-info shadow-sm h-100">
                                        <div className="card-inner">
                                            <div className="card-title-group align-start mb-2">
                                                <div className="card-title">
                                                    <h6 className="title text-soft">NON PONDOK</h6>
                                                </div>
                                                <div className="card-tools">
                                                    <Icon name="user-fill" className="text-info fs-3" />
                                                </div>
                                            </div>
                                            <div className="data-group align-end flex-wrap g-3 justify-between">
                                                <div className="amount text-info fs-2">{data.stats.nonBoarding}</div>
                                                <div className="danger text-soft small">Pulang Pergi</div>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                                <Col md={2}>
                                    <Card className="card-bordered border-success shadow-sm h-100">
                                        <div className="card-inner">
                                            <div className="card-title-group align-start mb-2">
                                                <div className="card-title">
                                                    <h6 className="title text-soft">TERVERIFIKASI</h6>
                                                </div>
                                                <div className="card-tools">
                                                    <Icon name="check-circle-fill" className="text-success fs-3" />
                                                </div>
                                            </div>
                                            <div className="data-group align-end flex-wrap g-3 justify-between">
                                                <div className="amount text-success fs-2">{data.stats.verified}</div>
                                                <div className="info text-soft small">Dokumen Lengkap</div>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                                <Col md={2}>
                                    <Card className="card-bordered border-warning shadow-sm h-100">
                                        <div className="card-inner">
                                            <div className="card-title-group align-start mb-2">
                                                <div className="card-title">
                                                    <h6 className="title text-soft">PENDING</h6>
                                                </div>
                                                <div className="card-tools">
                                                    <Icon name="alert-circle-fill" className="text-warning fs-3" />
                                                </div>
                                            </div>
                                            <div className="data-group align-end flex-wrap g-3 justify-between">
                                                <div className="amount text-warning fs-2">{data.stats.unverified}</div>
                                                <div className="info text-soft small">Perlu Reviu</div>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                                <Col md={2}>
                                    <Card className="card-bordered border-danger shadow-sm h-100">
                                        <div className="card-inner">
                                            <div className="card-title-group align-start mb-2">
                                                <div className="card-title">
                                                    <h6 className="title text-soft">MENGUNDURKAN</h6>
                                                </div>
                                                <div className="card-tools">
                                                    <Icon name="alert-circle-fill" className="text-danger fs-3" />
                                                </div>
                                            </div>
                                            <div className="data-group align-end flex-wrap g-3 justify-between">
                                                <div className="amount text-danger fs-2">{data.stats.out}</div>
                                                <div className="info text-soft small">Mengundurkan Diri</div>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                                <Col md={12}>
                                <div className="d-flex flex-wrap g-3">
                                {data.stats.programs.map((prog, idx) => (
                                    <div key={idx} style={{ flex: "1 0 18%", minWidth: "200px" }}>
                                        <Card className="card-bordered border-gray shadow-sm h-100">
                                            <div className="card-inner">
                                                <div className="card-title-group align-start mb-2">
                                                    <div className="card-title">
                                                        <h6 className="title text-soft">{prog.name.toUpperCase()}</h6>
                                                    </div>
                                                    <div className="card-tools">
                                                        <Icon name="award-fill" className="text-gray fs-3" />
                                                    </div>
                                                </div>
                                                <div className="data-group align-end flex-wrap g-3 justify-between">
                                                    <div className="amount text-gray fs-2">{prog.total}</div>
                                                    <div className="info text-soft small">Siswa Pilihan</div>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                ))}
                                </div>
                                </Col>
                                <Col md={8}>
                                    <PreviewCard className="h-100">
                                        <div className="card-title-group align-start mb-3">
                                            <div className="card-title">
                                                <h6 className="title">Pendaftar Terbaru</h6>
                                                <p className="text-soft small">6 Calon siswa terakhir yang mendaftar</p>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <Table className="table-borderless">
                                                <thead>
                                                    <tr className="text-soft small">
                                                        <th>Siswa</th>
                                                        <th>Gender</th>
                                                        <th>Waktu Daftar</th>
                                                        <th className="text-center">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.recentStudents.map((stu, i) => (
                                                        <tr key={i} className="border-bottom-soft">
                                                            <td>
                                                                <span className="fw-medium text-dark">{stu.name}</span>
                                                            </td>
                                                            <td className="small text-soft">{getGender(stu.gender)}</td>
                                                            <td className="small text-soft">{moment(stu.created_at).format('DD MMM YY HH:mm')}</td>
                                                            <td className="text-center">
                                                                <Badge color={stu.verified ? 'success' : 'warning'} className="badge-dot">
                                                                    {stu.verified ? 'Verified' : 'Pending'}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {data.recentStudents.length === 0 && (
                                                        <tr>
                                                            <td colSpan={4} className="text-center text-soft py-4">Belum ada siswa yang mendaftar</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </PreviewCard>
                                </Col>

                                <Col md={4}>
                                    <PreviewCard className="h-100">
                                        <div className="card-title-group align-start mb-4">
                                            <div className="card-title">
                                                <h6 className="title">Akses Cepat</h6>
                                                <p className="text-soft small">Kelola data madrasah dengan mudah</p>
                                            </div>
                                        </div>
                                        <div className="list-group list-group-flush gy-2">
                                            <Link to="/data-pendaftar/tambah" className="list-group-item list-group-item-action d-flex align-items-center p-3 border rounded mb-2">
                                                <div className="icon-wrap bg-primary-dim me-3">
                                                    <Icon name="user-add-fill" className="text-primary" />
                                                </div>
                                                <div>
                                                    <h6 className="mb-0">Registrasi Siswa</h6>
                                                    <small className="text-soft">Input data pendaftar baru</small>
                                                </div>
                                            </Link>
                                            <Link to={`/data-lembaga`} className="list-group-item list-group-item-action d-flex align-items-center p-3 border rounded mb-2">
                                                <div className="icon-wrap bg-info-dim me-3">
                                                    <Icon name="setting-fill" className="text-info" />
                                                </div>
                                                <div>
                                                    <h6 className="mb-0">Informasi Lembaga</h6>
                                                    <small className="text-soft">Update profil & logo madrasah</small>
                                                </div>
                                            </Link>
                                            <Link to="/master-data/periode-pendaftaran" className="list-group-item list-group-item-action d-flex align-items-center p-3 border rounded">
                                                <div className="icon-wrap bg-warning-dim me-3">
                                                    <Icon name="calendar-fill" className="text-warning" />
                                                </div>
                                                <div>
                                                    <h6 className="mb-0">Periode Daftar</h6>
                                                    <small className="text-soft">Kelola gelombang pendaftaran</small>
                                                </div>
                                            </Link>
                                        </div>
                                    </PreviewCard>
                                </Col>
                            </>
                        )
                    )}
                </Row>
            </Content>
        </React.Fragment>
    );
};

export default OperatorDashboard;
