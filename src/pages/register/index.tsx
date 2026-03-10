import React, { useState } from "react";
import Head from "@/layout/head";
import Content from "@/layout/content";
import {
    Block,
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Button, Col,
    Icon,
    PreviewCard,
    Row
} from "@/components";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import StudentPersonal from "./partials/personal";
import StudentParent from "./partials/parent";
import StudentAddress from "./partials/address";
import StudentProgram from "./partials/program";
import StudentOrigin from "./partials/origin";
import StudentAchievement from "./partials/achievement";

const StudentRegister = () => {
    const [sm, updateSm] = useState(false)
    const [activeIconTab, setActiveIconTab] = useState("1");
    const toggleIconTab = (icontab: string) => {
        if (activeIconTab !== icontab) setActiveIconTab(icontab);
    };
    return (
        <React.Fragment>
            <Head title="Pendaftaran" />
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Pendaftaran</BlockTitle>
                                <p>
                                    Textual form controls—like <code className="code-tag">&lt;input&gt;</code>s,{" "}
                                    <code className="code-tag">&lt;select&gt;</code>s, and{" "}
                                </p>
                            </BlockHeadContent>
                            <BlockHeadContent>
                                <div className="toggle-wrap nk-block-tools-toggle">
                                    <Button
                                        className={`btn-icon btn-trigger toggle-expand me-n1 ${sm ? "active" : ""}`}
                                        onClick={() => updateSm(!sm)}
                                    >
                                        <Icon name="menu-alt-r" />
                                    </Button>
                                </div>
                            </BlockHeadContent>
                        </BlockBetween>
                    </BlockHead>
                    <Row className="gy-0">
                        <Col md={10}>
                            <PreviewCard>
                                <Nav tabs>
                                    <NavItem>
                                        <NavLink
                                            tag="a"
                                            href="#tab"
                                            className={classnames({ active: activeIconTab === "1" })}
                                            onClick={(ev) => {
                                                ev.preventDefault();
                                                toggleIconTab('1');
                                            }}
                                        >
                                            <Icon name="user" /> <span>Informasi Pribadi</span>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            tag="a"
                                            href="#tab"
                                            className={classnames({ active: activeIconTab === "2" })}
                                            onClick={(ev) => {
                                                ev.preventDefault();
                                                toggleIconTab("2");
                                            }}
                                        >
                                            <Icon name="users" /> <span>Informasi Orangtua</span>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            tag="a"
                                            href="#tab"
                                            className={classnames({ active: activeIconTab === "3" })}
                                            onClick={(ev) => {
                                                ev.preventDefault();
                                                toggleIconTab("3");
                                            }}
                                        >
                                            <Icon name="map-pin" /> <span>Tempat Tinggal</span>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            tag="a"
                                            href="#tab"
                                            className={classnames({ active: activeIconTab === "4" })}
                                            onClick={(ev) => {
                                                ev.preventDefault();
                                                toggleIconTab("4");
                                            }}
                                        >
                                            <Icon name="list" /> <span>Program Pilihan</span>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            tag="a"
                                            href="#tab"
                                            className={classnames({ active: activeIconTab === "5" })}
                                            onClick={(ev) => {
                                                ev.preventDefault();
                                                toggleIconTab("5");
                                            }}
                                        >
                                            <Icon name="building" /> <span>Sekolah Asal</span>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            tag="a"
                                            href="#tab"
                                            className={classnames({ active: activeIconTab === "6" })}
                                            onClick={(ev) => {
                                                ev.preventDefault();
                                                toggleIconTab("6");
                                            }}
                                        >
                                            <Icon name="medal" /> <span>Data Prestasi</span>
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <TabContent activeTab={activeIconTab}>
                                    <TabPane tabId="1">
                                        <StudentPersonal />
                                    </TabPane>
                                    <TabPane tabId="2">
                                        <StudentParent />
                                    </TabPane>
                                    <TabPane tabId="3">
                                        <StudentAddress />
                                    </TabPane>
                                    <TabPane tabId="4">
                                        <StudentProgram />
                                    </TabPane>
                                    <TabPane tabId="5">
                                        <StudentOrigin />
                                    </TabPane>
                                    <TabPane tabId="6">
                                        <StudentAchievement />
                                    </TabPane>
                                </TabContent>
                            </PreviewCard>
                        </Col>
                    </Row>
                </Block>
            </Content>
        </React.Fragment>
    )
}

export default StudentRegister;