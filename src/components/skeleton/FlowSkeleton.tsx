import React from "react";
import Head from "@/layout/head";
import Content from "@/layout/content";
import { Block, BlockHead, BlockHeadContent, BlockTitle, BlockDes, Row, Col, PreviewCard } from "@/components";
import { Card } from "reactstrap";

const FlowSkeleton = () => {
    return (
        <React.Fragment>
            <Head title="Loading..." />
            <Content page="component">
                <BlockHead size="lg" className="text-center">
                    <BlockHeadContent>
                        <BlockTitle page className="placeholder-glow">
                            <span className="placeholder col-6"></span>
                        </BlockTitle>
                        <BlockDes className="text-soft placeholder-glow">
                            <p className="placeholder col-4"></p>
                        </BlockDes>
                    </BlockHeadContent>
                </BlockHead>

                <Block>
                    <div className="timeline-zigzag">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className={`timeline-item ${i % 2 !== 0 ? 'left' : 'right'} placeholder-glow`}>
                                <div className="timeline-icon bg-light"></div>
                                <div className="timeline-content">
                                    <Card className="card-bordered bg-transparent shadow-sm h-100">
                                        <div className="card-inner">
                                            <div className="d-flex align-items-center mb-3 placeholder-glow">
                                                <span className="placeholder rounded-pill me-2" style={{ width: '80px', height: '20px' }}></span>
                                                <h5 className="title mb-0 placeholder col-6"></h5>
                                            </div>
                                            <p className="text-soft placeholder-glow">
                                                <span className="placeholder col-12"></span>
                                                <span className="placeholder col-8"></span>
                                            </p>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        ))}
                    </div>
                </Block>

                <Block size="lg">
                    <Row className="g-gs">
                        <Col lg={6}>
                            <PreviewCard className="h-100 bg-light">
                                <div className="card-inner">
                                    <div className="align-center flex-wrap flex-md-nowrap g-4 placeholder-glow">
                                        <div className="media media-lg media-middle media-circle bg-white placeholder" style={{ width: '60px', height: '60px' }}></div>
                                        <div className="media-content w-100">
                                            <h4 className="title placeholder col-6 mb-2"></h4>
                                            <p className="placeholder col-10 mb-2"></p>
                                            <div className="row g-3 mt-2">
                                                {[1, 2, 3, 4].map((i) => (
                                                    <div key={i} className="col-sm-6 placeholder col-5"></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </PreviewCard>
                        </Col>
                        <Col lg={6}>
                            <PreviewCard className="h-100 bg-light">
                                <div className="card-inner">
                                    <div className="align-center flex-wrap flex-md-nowrap g-4 placeholder-glow">
                                        <div className="media media-lg media-middle media-circle bg-white placeholder" style={{ width: '60px', height: '60px' }}></div>
                                        <div className="media-content w-100">
                                            <h4 className="title placeholder col-6 mb-2"></h4>
                                            <p className="placeholder col-10 mb-2"></p>
                                            <div className="mt-3 d-flex gap-2">
                                                <span className="btn btn-dim disabled placeholder col-4"></span>
                                                <span className="btn btn-white disabled placeholder col-4"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </PreviewCard>
                        </Col>
                    </Row>
                </Block>

                <Block className="text-center mt-5">
                    <Card className="card-bordered bg-light">
                        <div className="card-inner placeholder-glow">
                            <h3 className="title placeholder col-4 mx-auto mb-3"></h3>
                            <p className="lead text-soft placeholder col-6 mx-auto mb-4"></p>
                            <span className="btn btn-lg disabled placeholder col-3"></span>
                        </div>
                    </Card>
                </Block>
            </Content>

            <style>{`
                .timeline-zigzag {
                    position: relative;
                    padding: 40px 0;
                    overflow: hidden;
                }
                .timeline-zigzag::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 50%;
                    width: 4px;
                    margin-left: -2px;
                    background: #e5e9f2;
                }
                .timeline-item {
                    position: relative;
                    width: 50%;
                    padding-bottom: 40px;
                }
                .timeline-item.left {
                    left: 0;
                    padding-right: 40px;
                }
                .timeline-item.right {
                    left: 50%;
                    padding-left: 40px;
                }
                .timeline-icon {
                    position: absolute;
                    top: 0;
                    right: -24px;
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1;
                    font-size: 1.25rem;
                    border: 4px solid #fff;
                    box-shadow: 0 0 0 4px #e5e9f2;
                }
                .timeline-item.right .timeline-icon {
                    left: -24px;
                    right: auto;
                }
                .timeline-content {
                    position: relative;
                }
                
                @media (max-width: 991px) {
                    .timeline-zigzag::before {
                        left: 24px;
                    }
                    .timeline-item {
                        width: 100%;
                        left: 0 !important;
                        padding-left: 60px !important;
                        padding-right: 0 !important;
                    }
                    .timeline-icon {
                        left: 0 !important;
                        right: auto !important;
                    }
                }
            `}</style>
        </React.Fragment>
    );
};

export default FlowSkeleton;
