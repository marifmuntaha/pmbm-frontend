import React, { useEffect, useState } from "react";
import Head from "@/layout/head";
import Content from "@/layout/content";
import { Block, BlockHead, BlockHeadContent, BlockTitle, BlockDes, RulesSkeleton } from "@/components";
import { Card, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import { rules } from "@/common/api/public";
import type { RulesDataType } from "@/types";

const Rules = () => {
    const [data, setData] = useState<RulesDataType | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("general");

    const toggle = (tab: string) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    useEffect(() => {
        const getData = async () => {
            await rules().then((res) => {
                if (res) {
                    setData(res);
                }
            }).catch((e) => {
                console.error("Error fetching rules data", e);
            }).finally(() => {
                setLoading(false);
            });
        };

        getData();
    }, []);

    if (loading) {
        return <RulesSkeleton />;
    }
    return (
        <React.Fragment>
            <Head title="Aturan & Prosedur" />
            <Content page="component">
                <BlockHead size="sm">
                    <BlockHeadContent>
                        <BlockTitle page>Aturan dan Prosedur Pendaftaran</BlockTitle>
                        <BlockDes className="text-soft">
                            <p>Panduan lengkap pendaftaran santri baru.</p>
                        </BlockDes>
                    </BlockHeadContent>
                </BlockHead>

                <Block>
                    <Card className="card-bordered">
                        <div className="card-inner">
                            <Nav tabs className="mt-n3">
                                <NavItem>
                                    <NavLink
                                        tag="a"
                                        href="#tab"
                                        className={classnames({ active: activeTab === "general" })}
                                        onClick={(ev) => {
                                            ev.preventDefault();
                                            toggle("general");
                                        }}
                                    >
                                        <span className="fw-bold">Aturan Umum</span>
                                    </NavLink>
                                </NavItem>
                                {data?.institutions.map((inst) => (
                                    <NavItem key={inst.id}>
                                        <NavLink
                                            tag="a"
                                            href="#tab"
                                            className={classnames({ active: activeTab === inst.surname })}
                                            onClick={(ev) => {
                                                ev.preventDefault();
                                                toggle(inst.surname);
                                            }}
                                        >
                                            <span className="fw-bold">{inst.surname}</span>
                                        </NavLink>
                                    </NavItem>
                                ))}
                            </Nav>
                            <TabContent activeTab={activeTab} className="mt-4">
                                <TabPane tabId="general">
                                    <div className="entry">
                                        <h5 className="title mb-3 text-primary">Aturan Umum Pendaftaran</h5>
                                        {data?.general && data.general.length > 0 ? (
                                            <ul className="list list-lg list-checked list-checked-primary">
                                                {data.general.map((rule) => (
                                                    <li key={rule.id}>{rule.content}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-soft">Belum ada aturan umum yang ditambahkan.</p>
                                        )}
                                    </div>
                                </TabPane>
                                {data?.institutions.map((inst) => (
                                    <TabPane tabId={inst.surname} key={inst.id}>
                                        <div className="d-flex align-items-center mb-4">
                                            <div className="user-avatar md bg-transparent border">
                                                <img src={inst.logo} alt={inst.surname} />
                                            </div>
                                            <div className="ms-3">
                                                <h5 className="title mb-0 text-primary">{inst.name}</h5>
                                                <span className="sub-text">Ketentuan Khusus</span>
                                            </div>
                                        </div>

                                        {inst.rules && inst.rules.length > 0 ? (
                                            <ul className="list list-lg list-checked list-checked-primary">
                                                {inst.rules.map((rule) => (
                                                    <li key={rule.id}>{rule.content}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-soft">Belum ada aturan khusus untuk lembaga ini.</p>
                                        )}
                                    </TabPane>
                                ))}
                            </TabContent>
                        </div>
                    </Card>
                </Block>
            </Content>
        </React.Fragment>
    );
};

export default Rules;
