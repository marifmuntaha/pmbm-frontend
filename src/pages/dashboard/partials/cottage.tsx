import React, { useEffect, useState } from "react";
import Head from "@/layout/head";
import Content from "@/layout/content";
import moment from "moment/moment";
import 'moment/locale/id';
import { Col, Icon, PreviewCard, Row } from "@/components";
import { Badge, Card, Progress, Spinner } from "reactstrap";
import { useAuthContext } from "@/common/hooks/useAuthContext";
import { useYearContext } from "@/common/hooks/useYearContext";
import { getRoleName } from "@/helpers";
import { get as getRooms } from "@/common/api/master/room";
import { studentBoarding } from "@/common/api/student";
import type { StudentBoardingType } from "@/types";

moment.locale('id');

interface CottageStats {
    totalStudents: number;
    maleStudents: number;
    femaleStudents: number;
    capacity: number;
    programBreakdown: Array<{
        programName: string;
        count: number;
    }>;
    recentRegistrations: Array<StudentBoardingType>;
}

const Cottage = () => {
    const year = useYearContext();
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<CottageStats>({
        totalStudents: 0,
        maleStudents: 0,
        femaleStudents: 0,
        capacity: 100,
        programBreakdown: [],
        recentRegistrations: []
    });

    useEffect(() => {
        if (!year?.id) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [students, rooms] = await Promise.all([
                    studentBoarding({
                        yearId: year.id,
                        verified: 1,
                        paid: 1,
                        boarding: true
                    }),
                    getRooms({ list: 'all' })
                ]);

                const totalStudents = students.length;
                const maleStudents = students.filter(s => s.gender === 1).length;
                const femaleStudents = students.filter(s => s.gender === 2).length;
                const capacity = rooms.reduce((acc, r) => acc + (Number(r.capacity) || 0), 0);
                const programMap = new Map<string, number>();
                students.forEach(s => {
                    const prog = s.institution || 'Lainnya';
                    programMap.set(prog, (programMap.get(prog) || 0) + 1);
                });

                const programBreakdown = Array.from(programMap.entries()).map(([programName, count]) => ({
                    programName,
                    count
                }));

                const recentRegistrations = [...students]
                    .sort((a, b) => (b.id || 0) - (a.id || 0))
                    .slice(0, 5);

                setStats({
                    totalStudents,
                    maleStudents,
                    femaleStudents,
                    capacity,
                    programBreakdown,
                    recentRegistrations
                });

            } catch (error) {
                console.error("Failed to fetch cottage stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [year]);

    const occupancyRate = Math.round((stats.totalStudents / stats.capacity) * 100);
    const availableSlots = stats.capacity - stats.totalStudents;

    return (
        <React.Fragment>
            <Head title="Dashboard" />
            <Content>
                <Row className="gy-4">
                    {/* Header Card */}
                    <Col md={12}>
                        <PreviewCard className="bg-info-dim border-info">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <Icon name="home-fill" className="text-info fs-1 me-3" />
                                    <div>
                                        <h4 className="title text-info mb-1">Dashboard Boarding</h4>
                                        <p className="text-soft mb-0">
                                            Selamat datang, <strong>{user?.name}</strong> ({getRoleName(user?.role)})<br />
                                            Tahun Ajaran: <strong>{year?.name || '-'}</strong>
                                        </p>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <p className="text-soft fs-12px mb-1">
                                        <Icon name="calendar" /> {moment().format('dddd, DD MMMM YYYY')}
                                    </p>
                                    <p className="text-soft fs-12px mb-0">
                                        <Icon name="clock" /> {moment().format('HH:mm')} WIB
                                    </p>
                                </div>
                            </div>
                        </PreviewCard>
                    </Col>

                    {loading ? (
                        <Col md={12} className="text-center">
                            <Spinner color="primary" />
                        </Col>
                    ) : (
                        <>
                            {/* Overview Statistics */}
                            <Col md={12}>
                                <h6 className="title mb-3">Ringkasan Statistik</h6>
                                <Row className="gy-3">
                                    <Col sm={6} lg={3}>
                                        <Card className="card-bordered h-100">
                                            <div className="card-inner">
                                                <div className="card-title-group align-start mb-2">
                                                    <div className="card-title">
                                                        <h6 className="subtitle">Total Santri</h6>
                                                    </div>
                                                    <div className="card-tools">
                                                        <Icon name="users" className="text-primary" />
                                                    </div>
                                                </div>
                                                <div className="align-end flex-sm-wrap g-4">
                                                    <div className="nk-sale-data">
                                                        <span className="amount">{stats.totalStudents}</span>
                                                        <span className="sub-title text-soft">Santri Aktif</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>

                                    <Col sm={6} lg={3}>
                                        <Card className="card-bordered h-100">
                                            <div className="card-inner">
                                                <div className="card-title-group align-start mb-2">
                                                    <div className="card-title">
                                                        <h6 className="subtitle">Kapasitas Tersedia</h6>
                                                    </div>
                                                    <div className="card-tools">
                                                        <Icon name="home" className="text-success" />
                                                    </div>
                                                </div>
                                                <div className="align-end flex-sm-wrap g-4">
                                                    <div className="nk-sale-data">
                                                        <span className="amount">{availableSlots}</span>
                                                        <span className="sub-title text-soft">Slot Kosong</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>

                                    <Col sm={6} lg={3}>
                                        <Card className="card-bordered h-100">
                                            <div className="card-inner">
                                                <div className="card-title-group align-start mb-2">
                                                    <div className="card-title">
                                                        <h6 className="subtitle">Tingkat Hunian</h6>
                                                    </div>
                                                    <div className="card-tools">
                                                        <Icon name="growth" className="text-info" />
                                                    </div>
                                                </div>
                                                <div className="align-end flex-sm-wrap g-4">
                                                    <div className="nk-sale-data">
                                                        <span className="amount">{occupancyRate}%</span>
                                                        <span className="sub-title text-soft">Terisi</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>

                                    <Col sm={6} lg={3}>
                                        <Card className="card-bordered h-100">
                                            <div className="card-inner">
                                                <div className="card-title-group align-start mb-2">
                                                    <div className="card-title">
                                                        <h6 className="subtitle">Kapasitas Total</h6>
                                                    </div>
                                                    <div className="card-tools">
                                                        <Icon name="building" className="text-warning" />
                                                    </div>
                                                </div>
                                                <div className="align-end flex-sm-wrap g-4">
                                                    <div className="nk-sale-data">
                                                        <span className="amount">{stats.capacity}</span>
                                                        <span className="sub-title text-soft">Total Slot</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                                </Row>
                            </Col>

                            {/* Gender Distribution & Occupancy Progress */}
                            <Col md={12}>
                                <Row className="gy-3">
                                    <Col md={6}>
                                        <Card className="card-bordered h-100">
                                            <div className="card-inner">
                                                <h6 className="title mb-3">Distribusi Gender</h6>
                                                <div className="mb-3">
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <span className="text-soft">
                                                            <Icon name="user-fill-c" className="text-primary me-1" />
                                                            Laki-laki
                                                        </span>
                                                        <span className="fw-bold">{stats.maleStudents} santri</span>
                                                    </div>
                                                    <Progress
                                                        value={(stats.maleStudents / stats.totalStudents) * 100}
                                                        color="primary"
                                                        style={{ height: '8px' }}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <span className="text-soft">
                                                            <Icon name="user-fill-c" className="text-pink me-1" />
                                                            Perempuan
                                                        </span>
                                                        <span className="fw-bold">{stats.femaleStudents} santri</span>
                                                    </div>
                                                    <Progress
                                                        value={(stats.femaleStudents / stats.totalStudents) * 100}
                                                        color="pink"
                                                        style={{ height: '8px' }}
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>

                                    <Col md={6}>
                                        <Card className="card-bordered h-100">
                                            <div className="card-inner">
                                                <h6 className="title mb-3">Status Kapasitas</h6>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="text-soft">Terisi</span>
                                                    <span className="fw-bold">{stats.totalStudents} / {stats.capacity} santri</span>
                                                </div>
                                                <Progress
                                                    value={occupancyRate}
                                                    color={occupancyRate >= 80 ? 'danger' : occupancyRate >= 60 ? 'warning' : 'success'}
                                                    style={{ height: '20px' }}
                                                >
                                                    {occupancyRate}%
                                                </Progress>
                                                <div className="mt-3">
                                                    <Badge
                                                        color={occupancyRate >= 80 ? 'danger' : occupancyRate >= 60 ? 'warning' : 'success'}
                                                        className="badge-dim"
                                                    >
                                                        {occupancyRate >= 80 ? 'Hampir Penuh' : occupancyRate >= 60 ? 'Sedang' : 'Masih Banyak Tersedia'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                                </Row>
                            </Col>

                            {/* Program Breakdown */}
                            <Col md={6}>
                                <Card className="card-bordered h-100">
                                    <div className="card-inner">
                                        <h6 className="title mb-3">Distribusi Program Pendidikan</h6>
                                        {stats.programBreakdown.map((program, index) => {
                                            const percentage = Math.round((program.count / stats.totalStudents) * 100);
                                            return (
                                                <div key={index} className="mb-3">
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <span className="text-soft">{program.programName}</span>
                                                        <span className="fw-bold">{program.count} santri ({percentage}%)</span>
                                                    </div>
                                                    <Progress
                                                        value={percentage}
                                                        color={index % 3 === 0 ? 'primary' : index % 3 === 1 ? 'info' : 'success'}
                                                        style={{ height: '8px' }}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Card>
                            </Col>

                            {/* Recent Registrations */}
                            <Col md={6}>
                                <Card className="card-bordered h-100">
                                    <div className="card-inner">
                                        <h6 className="title mb-3">Pendaftaran Terbaru</h6>
                                        {stats.recentRegistrations.length === 0 ? (
                                            <p className="text-soft text-center py-3">Belum ada pendaftaran baru</p>
                                        ) : (
                                            <ul className="list-group list-group-flush">
                                                {stats.recentRegistrations.map((reg) => (
                                                    <li key={reg.id} className="list-group-item px-0">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div className="d-flex align-items-center">
                                                                <div className="user-avatar sm bg-primary-dim me-2">
                                                                    <Icon name="user" />
                                                                </div>
                                                                <div>
                                                                    <div className="fw-bold">{reg.name}</div>
                                                                    <div className="text-soft fs-12px">{reg.institution}</div>
                                                                </div>
                                                            </div>
                                                            {/* <div className="text-end">
                                                                <div className="fs-12px text-soft">
                                                                    {moment(reg.registeredAt).fromNow()}
                                                                </div>
                                                            </div> */}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </Card>
                            </Col>
                        </>
                    )}
                </Row>
            </Content>
        </React.Fragment>
    );
};

export default Cottage;
