import React from "react";
import Head from "@/layout/head";
import Content from "@/layout/content";
import { Block, BlockHead, BlockHeadContent, BlockTitle, BlockDes } from "@/components";
import { Card, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";


const RulesSkeleton = () => {
    return (
        <React.Fragment>
            <Head title="Loading..." />
            <Content page="component">
                <BlockHead size="sm">
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
                    <Card className="card-bordered" style={{ height: '350px' }}>
                        <div className="card-inner">
                            <div className="placeholder-glow">
                                <Nav tabs className="mt-n3">
                                    <NavItem>
                                        <NavLink className="active">
                                            <span className="fw-bold placeholder col-12" style={{ width: '100px', display: 'inline-block' }}></span>
                                        </NavLink>
                                    </NavItem>
                                    {[1, 2, 3].map((i) => (
                                        <NavItem key={i}>
                                            <NavLink>
                                                <span className="fw-bold placeholder col-12" style={{ width: '80px', display: 'inline-block' }}></span>
                                            </NavLink>
                                        </NavItem>
                                    ))}
                                </Nav>
                                <TabContent activeTab="1" className="mt-4">
                                    <TabPane tabId="1">
                                        <div className="entry">
                                            <h5 className="title mb-3 placeholder col-4"></h5>
                                            <div className="d-flex flex-column gap-3">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <div key={i} className="d-flex align-items-center placeholder-glow">
                                                        <span className="placeholder rounded-circle me-3" style={{ width: '24px', height: '24px' }}></span>
                                                        <span className="placeholder col-10" style={{ height: '14px' }}></span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </TabPane>
                                </TabContent>
                            </div>
                        </div>
                    </Card>
                </Block>
            </Content>
        </React.Fragment>
    );
};

export default RulesSkeleton;
