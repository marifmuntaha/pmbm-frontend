import React, { useEffect, useState } from "react";
import Head from "@/layout/head";
import Content from "@/layout/content";
import { Col, Icon, PreviewCard, Row } from "@/components";
import { useAuthContext } from "@/common/hooks/useAuthContext";
import { formatIDR } from "@/helpers";
import { Card, Progress, Table } from "reactstrap";
import { useYearContext } from "@/common/hooks/useYearContext";
import { useInstitutionContext } from "@/common/hooks/useInstitutionContext";
import { getStats } from "@/common/api/report";
import moment from "moment/moment";
import 'moment/locale/id';

moment.locale('id');

type DashboardStats = {
    totalStudents: number;
    totalInvoiced: number;
    totalPaid: number;
    remainingBalance: number;
    recentPayments: any[];
}

const Treasurer = () => {
    const { user } = useAuthContext();
    const year = useYearContext();
    const institution = useInstitutionContext();
    const [stats, setStats] = useState<DashboardStats | null>(null);

    useEffect(() => {
        if (year?.id && institution?.id) {
            getStats<DashboardStats>({
                yearId: year.id,
                institutionId: institution.id
            })
                .then((resp) => {
                    setStats(resp);
                })
        }
    }, [year, institution]);

    const collectionRate = stats ? Math.round((stats.totalPaid / stats.totalInvoiced) * 100) : 0;

    return (
        <React.Fragment>
            <Head title="Dashboard Bendahara" />
            <Content>
                <Row className="gy-4">
                    <Col md={12}>
                        <PreviewCard className="bg-info-dim border-info">
                            <div className="d-flex align-items-center">
                                <Icon name="wallet-fill" className="text-info fs-1 me-3" />
                                <div>
                                    <h4 className="title text-info mb-1">Status Keuangan PMB</h4>
                                    <p className="text-soft">Selamat datang, {user?.name}. Berikut rekapitulasi pembayaran {institution?.surname} TA {year?.name}</p>
                                </div>
                            </div>
                        </PreviewCard>
                    </Col>

                    {stats && (
                        <>
                            <Col md={3}>
                                <Card className="card-bordered border-primary">
                                    <div className="card-inner">
                                        <div className="card-title-group align-start mb-2">
                                            <div className="card-title">
                                                <h6 className="title text-soft">TOTAL PENDAFTAR</h6>
                                            </div>
                                            <div className="card-tools">
                                                <Icon name="users-fill" className="text-primary fs-4" />
                                            </div>
                                        </div>
                                        <div className="align-end flex-wrap g-3 justify-between">
                                            <div className="data">
                                                <div className="amount">{stats.totalStudents}</div>
                                                <div className="info">Siswa Terdaftar</div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="card-bordered border-info">
                                    <div className="card-inner">
                                        <div className="card-title-group align-start mb-2">
                                            <div className="card-title">
                                                <h6 className="title text-soft">TOTAL TAGIHAN</h6>
                                            </div>
                                            <div className="card-tools">
                                                <Icon name="file-text-fill" className="text-info fs-4" />
                                            </div>
                                        </div>
                                        <div className="align-end flex-wrap g-3 justify-between">
                                            <div className="data">
                                                <div className="amount text-info">{formatIDR(stats.totalInvoiced)}</div>

                                                <div className="info text-soft small italic">Potensi Pendapatan</div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="card-bordered border-success">
                                    <div className="card-inner">
                                        <div className="card-title-group align-start mb-2">
                                            <div className="card-title">
                                                <h6 className="title text-soft">TOTAL TERBAYAR</h6>
                                            </div>
                                            <div className="card-tools">
                                                <Icon name="check-circle-fill" className="text-success fs-4" />
                                            </div>
                                        </div>
                                        <div className="align-end flex-wrap g-3 justify-between">
                                            <div className="data">
                                                <div className="amount text-success">{formatIDR(stats.totalPaid)}</div>

                                                <div className="info">Dana Terkumpul</div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="card-bordered border-danger">
                                    <div className="card-inner">
                                        <div className="card-title-group align-start mb-2">
                                            <div className="card-title">
                                                <h6 className="title text-soft">SISA TAGIHAN</h6>
                                            </div>
                                            <div className="card-tools">
                                                <Icon name="alert-circle-fill" className="text-danger fs-4" />
                                            </div>
                                        </div>
                                        <div className="align-end flex-wrap g-3 justify-between">
                                            <div className="data">
                                                <div className="amount text-danger">{formatIDR(stats.remainingBalance)}</div>

                                                <div className="info">Belum Tertagih</div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <PreviewCard>
                                    <div className="card-title-group align-start mb-3">
                                        <div className="card-title">
                                            <h6 className="title">Transaksi Terbaru</h6>
                                            <p className="text-soft small">10 Transaksi terakhir yang masuk</p>
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <Table className="table-borderless">
                                            <thead>
                                                <tr className="text-soft small">
                                                    <th>Waktu</th>
                                                    <th>Siswa</th>
                                                    <th className="text-end">Jumlah</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stats.recentPayments.map((pay, i) => (
                                                    <tr key={i} className="border-bottom-soft">
                                                        <td className="small">{moment(pay.transaction_time || pay.created_at).format('DD/MM HH:mm')}</td>
                                                        <td>
                                                            <span className="fw-medium text-dark">{pay.name}</span>
                                                            <div className="text-soft fs-11px">{pay.method === 1 ? 'Cash' : 'Midtrans'}</div>
                                                        </td>
                                                        <td className="text-end text-success fw-bold">{formatIDR(pay.amount)}</td>

                                                    </tr>
                                                ))}
                                                {stats.recentPayments.length === 0 && (
                                                    <tr>
                                                        <td colSpan={3} className="text-center text-soft py-3">Belum ada transaksi</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>
                                </PreviewCard>
                            </Col>
                            <Col md={6}>
                                <PreviewCard>
                                    <div className="card-title-group align-start mb-3">
                                        <div className="card-title">
                                            <h6 className="title">Progress Pengumpulan Dana</h6>
                                            <p className="text-soft small">Rasio tertagih terhadap potensi pendapatan</p>
                                        </div>
                                    </div>
                                    <div className="progress-list gy-3">
                                        <div className="progress-wrap">
                                            <div className="progress-text">
                                                <div className="samples-name text-soft">Target Terpenuhi</div>
                                                <div className="samples-amount h6">{collectionRate}%</div>
                                            </div>
                                            <Progress color="success" value={collectionRate} />
                                        </div>
                                    </div>
                                    <div className="mt-4 text-soft small border-top pt-3 ff-italic">
                                        Update terakhir: {moment().locale('id').format('DD MMMM YYYY HH:mm')}

                                    </div>
                                </PreviewCard>
                            </Col>
                        </>
                    )}
                </Row>
            </Content>
        </React.Fragment>
    );
};

export default Treasurer;