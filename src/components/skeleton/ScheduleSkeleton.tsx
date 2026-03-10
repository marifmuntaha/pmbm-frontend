import React from "react";
import Head from "@/layout/head";
import Content from "@/layout/content";
import { Block, BlockHead, BlockHeadContent, BlockTitle, BlockDes, Row, Col, PreviewCard } from "@/components";

const ScheduleSkeleton = () => {
    return (
        <React.Fragment>
            <Head title="Loading..." />
            <Content page="component">
                <BlockHead size="sm">
                    <BlockHeadContent>
                        <BlockTitle page className="placeholder-glow">
                            <span className="placeholder col-4"></span>
                        </BlockTitle>
                        <BlockDes className="text-soft placeholder-glow">
                            <p className="placeholder col-6"></p>
                        </BlockDes>
                    </BlockHeadContent>
                </BlockHead>

                <Block>
                    <Row className="gy-4">
                        <Col md={12}>
                            <PreviewCard>
                                <div className="card-inner border-bottom">
                                    <div className="card-title-group">
                                        <div className="card-title placeholder-glow w-100">
                                            <h6 className="title placeholder col-3"></h6>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-inner">
                                    <div className="timeline">
                                        {[1, 2].map((month) => (
                                            <React.Fragment key={month}>
                                                <h6 className="timeline-head placeholder-glow mb-3">
                                                    <span className="placeholder col-2"></span>
                                                </h6>
                                                <ul className="timeline-list">
                                                    {[1, 2].map((item) => (
                                                        <li className="timeline-item" key={item}>
                                                            <div className="timeline-status bg-light"></div>
                                                            <div className="timeline-date placeholder-glow">
                                                                <span className="placeholder col-8"></span>
                                                            </div>
                                                            <div className="timeline-data">
                                                                <h6 className="timeline-title placeholder-glow mb-2">
                                                                    <span className="placeholder col-6"></span>
                                                                </h6>
                                                                <div className="timeline-des placeholder-glow">
                                                                    <p className="placeholder col-12"></p>
                                                                    <p className="placeholder col-10"></p>
                                                                    <span className="time text-muted small fst-italic placeholder col-4 mt-2 display-block"></span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            </PreviewCard>
                        </Col>
                    </Row>
                </Block>
            </Content>
        </React.Fragment>
    );
};

export default ScheduleSkeleton;
