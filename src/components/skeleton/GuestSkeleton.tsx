import React from "react";
import Head from "@/layout/head";
import Content from "@/layout/content";
import { Block, BlockHead, BlockHeadContent, BlockTitle, BlockDes, PreviewCard, Row, Col, BlockBetween } from "@/components";
import { Card } from "reactstrap";

const GuestSkeleton = () => {
    return (
        <React.Fragment>
            <Head title="Loading" />
            <Content>
                <div className="placeholder-glow">
                    <Row className="gy-4">
                        <Col md={12}>
                            <PreviewCard className="bg-light text-center py-5">
                                <h2 className="placeholder col-6 mb-3"></h2>
                                <p className="lead text-white-50 mb-4">
                                    <span className="placeholder col-8"></span>
                                </p>
                                <span className="placeholder col-2 btn btn-lg disabled"></span>
                            </PreviewCard>
                        </Col>

                        <Col md={12}>
                            <h4 className="title mb-4 placeholder col-4"></h4>
                        </Col>

                        {[1, 2, 3, 4].map((i) => (
                            <Col md={6} lg={3} key={i}>
                                <Card className="card-bordered h-100">
                                    <div className="card-inner">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="user-avatar lg bg-light border me-3 placeholder"></div>
                                            <div className="w-100">
                                                <h5 className="title mb-1 placeholder col-8"></h5>
                                                <span className="sub-text placeholder col-5"></span>
                                            </div>
                                        </div>
                                        <div className="alert alert-light alert-icon">
                                            <span className="placeholder col-12"></span>
                                            <span className="placeholder col-8 mt-1"></span>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <BlockHead size="sm" className="mt-5">
                        <BlockBetween className="g-3">
                            <BlockHeadContent className="w-100">
                                <BlockTitle tag="h5" className="placeholder col-3 mb-2">&nbsp;</BlockTitle>
                                <BlockDes>
                                    <p className="placeholder col-5"></p>
                                </BlockDes>
                            </BlockHeadContent>
                            <div className="form-group">
                                <div className="form-control-wrap">
                                    <div className="form-control placeholder col-12" style={{ width: "200px" }}></div>
                                </div>
                            </div>
                        </BlockBetween>
                    </BlockHead>

                    <Block>
                        <Card className="card-bordered card-preview">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="tb-col-os"><span className="overline-title placeholder col-12"></span></th>
                                            <th className="tb-col-ip"><span className="overline-title placeholder col-12"></span></th>
                                            <th className="tb-col-time"><span className="overline-title placeholder col-12"></span></th>
                                            <th className="tb-col-time"><span className="overline-title placeholder col-12"></span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <tr key={i}>
                                                <td className="tb-col-os"><span className="placeholder col-8"></span></td>
                                                <td className="tb-col-ip"><span className="placeholder col-6"></span></td>
                                                <td className="tb-col-time"><span className="placeholder col-10"></span></td>
                                                <td className="tb-col-time"><span className="placeholder col-10"></span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </Block>

                    <BlockHead size="sm" className="mt-5">
                        <BlockHeadContent className="w-100">
                            <BlockTitle tag="h5" className="placeholder col-3 mb-2">&nbsp;</BlockTitle>
                            <BlockDes>
                                <p className="placeholder col-5"></p>
                            </BlockDes>
                        </BlockHeadContent>
                    </BlockHead>

                    <Block>
                        <Row className="gy-4">
                            {[1, 2, 3].map((i) => (
                                <Col md={6} lg={3} key={i}>
                                    <Card className="card-bordered">
                                        <div className="card-inner">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center w-100">
                                                    <div className="user-avatar md bg-light border me-3 placeholder"></div>
                                                    <div className="w-100">
                                                        <h6 className="title mb-0 placeholder col-10"></h6>
                                                        <span className="sub-text placeholder col-6"></span>
                                                    </div>
                                                </div>
                                                <span className="btn btn-icon btn-light btn-sm disabled placeholder col-2"></span>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Block>
                </div>
            </Content>
        </React.Fragment>
    );
};

export default GuestSkeleton;
