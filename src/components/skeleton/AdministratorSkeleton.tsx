import React from "react";
import Head from "@/layout/head";
import Content from "@/layout/content";
import { Col, Icon, PreviewCard, Row, Button } from "@/components";
import { Card, Table } from "reactstrap";

const AdministratorSkeleton = () => {
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
                                        <h4 className="title text-primary mb-1">
                                            <span className="placeholder col-6"></span>
                                        </h4>
                                        <p className="text-soft">
                                            <span className="placeholder col-8"></span><br />
                                            <span className="placeholder col-5"></span>
                                        </p>
                                    </div>
                                </div>
                                <div className="d-none d-md-block">
                                    <Button color="primary" className="btn-dim disabled placeholder col-12" style={{ width: '150px' }}>
                                        &nbsp;
                                    </Button>
                                </div>
                            </div>
                        </PreviewCard>
                    </Col>
                    <Col md={12} className="mt-4">
                        <h5 className="title placeholder col-3"></h5>
                    </Col>
                    {/* Main Stats Skeleton */}
                    <Col md={6}>
                        <Card className="card-bordered border-primary h-100">
                            <div className="card-inner p-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="title text-primary fs-13px mb-0 placeholder col-4"></h6>
                                    <Icon name="users-fill" className="text-primary" />
                                </div>
                                <div className="d-flex align-items-baseline mb-3">
                                    <h3 className="amount text-primary mb-0 me-2 placeholder col-2"></h3>
                                    <span className="text-muted small">Siswa</span>
                                </div>
                                <div className="row g-2 border-top pt-2 mt-auto">
                                    <div className="col-6 border-end">
                                        <div className="d-flex align-items-center">
                                            <div className="dot dot-success me-2"></div>
                                            <div>
                                                <span className="d-block fw-bold text-dark fs-12px placeholder col-6"></span>
                                                <span className="d-block overly-small text-soft">Terverifikasi</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6 ps-3">
                                        <div className="d-flex align-items-center">
                                            <div className="dot dot-warning me-2"></div>
                                            <div>
                                                <span className="d-block fw-bold text-dark fs-12px placeholder col-6"></span>
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
                                    <h6 className="title text-danger fs-13px mb-0 placeholder col-4"></h6>
                                    <Icon name="home-fill" className="text-danger" />
                                </div>
                                <div className="d-flex align-items-baseline mb-3">
                                    <h3 className="amount text-danger mb-0 me-2 placeholder col-2"></h3>
                                    <span className="text-muted small">Siswa</span>
                                </div>
                                <div className="border-top pt-2 mt-auto">
                                    <h6 className="sub-title text-soft overly-small mb-2 placeholder col-3"></h6>
                                    <div className="row g-1">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div className="col-6" key={i}>
                                                <div className="d-flex justify-content-between align-items-center pe-2">
                                                    <span className="text-soft small placeholder col-6"></span>
                                                    <span className="fw-bold text-dark fs-11px placeholder col-2"></span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>

                    {/* Institutions Skeleton */}
                    {[1, 2, 3, 4].map((i) => (
                        <Col md={3} sm={6} key={`student-${i}`}>
                            <Card className="card-bordered h-100">
                                <div className="card-inner">
                                    <div className="card-title-group align-start mb-2">
                                        <div className="card-title w-100">
                                            <h6 className="title text-dark placeholder col-8"></h6>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-end mt-2">
                                        <div className="text-center">
                                            <span className="d-block h4 mb-0 text-primary placeholder col-12" style={{ width: '40px' }}></span>
                                            <span className="small text-soft">Total</span>
                                        </div>
                                        <div className="text-center border-start ps-3">
                                            <span className="d-block h4 mb-0 text-success placeholder col-12" style={{ width: '30px' }}></span>
                                            <span className="small text-soft">Oke</span>
                                        </div>
                                        <div className="text-center border-start ps-3">
                                            <span className="d-block h4 mb-0 text-warning placeholder col-12" style={{ width: '30px' }}></span>
                                            <span className="small text-soft">Pending</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}

                    {/* Financial Stats Skeleton */}
                    <Col md={12} className="mt-4">
                        <h5 className="title placeholder col-3"></h5>
                    </Col>
                    {[1, 2, 3, 4].map((i) => (
                        <Col md={3} sm={6} key={`finance-${i}`}>
                            <Card className="card-bordered h-100 border-info">
                                <div className="card-inner p-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h6 className="title text-dark mb-0 fs-13px placeholder col-6"></h6>
                                        <Icon name="wallet-fill" className="text-info" />
                                    </div>
                                    <div className="d-flex justify-content-between align-items-end">
                                        <div className="w-100">
                                            <div className="small text-soft">Tagihan</div>
                                            <div className="fw-bold text-dark placeholder col-6"></div>
                                        </div>
                                    </div>
                                    <div className="row g-0 mt-2 border-top pt-2">
                                        <div className="col-6 border-end pe-2">
                                            <div className="overly-small text-success">Terbayar</div>
                                            <div className="fw-bold fs-13px text-success placeholder col-8"></div>
                                        </div>
                                        <div className="col-6 ps-2">
                                            <div className="overly-small text-danger">Kurang</div>
                                            <div className="fw-bold fs-13px text-danger placeholder col-8"></div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}

                    {/* Tables Skeleton */}
                    <Col md={6} className="mt-4">
                        <PreviewCard className="h-100">
                            <div className="card-title-group align-start mb-3">
                                <div className="card-title w-100">
                                    <h6 className="title placeholder col-5"></h6>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <Table className="table-borderless table-sm table-hover">
                                    <thead>
                                        <tr className="text-soft small">
                                            <th>Siswa</th>
                                            <th>Lembaga</th>
                                            <th className="text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <tr key={i}>
                                                <td>
                                                    <span className="fw-medium text-dark d-block fs-12px placeholder col-8"></span>
                                                    <span className="small text-soft placeholder col-4"></span>
                                                </td>
                                                <td className="small text-dark fs-12px"><span className="placeholder col-6"></span></td>
                                                <td className="text-center">
                                                    <span className="placeholder col-4"></span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </PreviewCard>
                    </Col>

                    <Col md={6} className="mt-4">
                        <PreviewCard className="h-100">
                            <div className="card-title-group align-start mb-3">
                                <div className="card-title w-100">
                                    <h6 className="title placeholder col-5"></h6>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <Table className="table-borderless table-sm table-hover">
                                    <thead>
                                        <tr className="text-soft small">
                                            <th>Siswa</th>
                                            <th>Lembaga</th>
                                            <th className="text-end">Jumlah</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <tr key={i}>
                                                <td>
                                                    <span className="fw-medium text-dark d-block fs-12px placeholder col-8"></span>
                                                    <span className="small text-soft placeholder col-4"></span>
                                                </td>
                                                <td className="small text-dark fs-12px"><span className="placeholder col-6"></span></td>
                                                <td className="text-end fw-bold text-success fs-12px">
                                                    <span className="placeholder col-6"></span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </PreviewCard>
                    </Col>
                </Row>
            </Content>
        </React.Fragment>
    );
}

export default AdministratorSkeleton;
