import React, { useEffect, useState } from "react";
import Head from "@/layout/head";
import Content from "@/layout/content";
import { Col, Icon, PreviewCard, Row } from "@/components";
import { useAuthContext } from "@/common/hooks/useAuthContext";
import { formatIDR } from "@/helpers";
import { Card, Progress, Table } from "reactstrap";
import { useYearContext } from "@/common/hooks/useYearContext";
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

const Teller = () => {
    const { user } = useAuthContext();
    const year = useYearContext();
    const [stats, setStats] = useState<DashboardStats | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const resp = await getStats<DashboardStats>({yearId: year?.id,})
            if (resp) setStats(resp);
        }
        fetchData();
    }, [year]);

    const collectionRate = stats ? Math.round((stats.totalPaid / stats.totalInvoiced) * 100) : 0;

    return (
        <React.Fragment>
            <Head title="Dashboard Teller" />
            <Content>
                <Row className="gy-4">
                    <Col md={12}>
                        <PreviewCard className="bg-info-dim border-info">
                            <div className="d-flex align-items-center">
                                <Icon name="wallet-fill" className="text-info fs-1 me-3" />
                                <div>
                                    <h4 className="title text-info mb-1">Status Keuangan PMB</h4>
                                    <p className="text-soft fs-3x">Selamat datang, <span className="fw-bold">{user?.name}</span> . Anda login sebagai teller. <br/>
                                        Berikut rekapitulasi pembayaran Penerimaan Murid Baru Madrasah Tahun Ajaran {year?.name}</p>
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
                                                <div className="amount text-primary fw-bold">{stats.totalStudents} Siswa</div>
                                                <div className="info text-soft">Siswa Terdaftar</div>
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
                                                <div className="amount text-info fw-bold">{formatIDR(stats.totalInvoiced)}</div>
                                                <div className="info text-soft">Total Tagihan</div>
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
                                                <div className="amount text-success fw-bold">{formatIDR(stats.totalPaid)}</div>

                                                <div className="info text-soft">Total Terbayar</div>
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
                                                <div className="amount text-danger fw-bold">{formatIDR(stats.remainingBalance)}</div>

                                                <div className="info text-soft">Sisa Tagihan</div>
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
                                                    <th>Metode</th>
                                                    <th className="text-end">Jumlah</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stats.recentPayments.map((pay, i) => (
                                                    <tr key={i} className="border-bottom-soft">
                                                        <td className="small">{moment(pay.transaction_time || pay.created_at).format('DD/MM/YYYY HH:mm')}</td>
                                                        <td>
                                                            <span className="text-dark">{pay.name}</span>
                                                        </td>
                                                        <td><div className="text-soft fs-11px">{pay.method === 1 ? 'Cash' : 'Midtrans'}</div></td>
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

export default Teller;