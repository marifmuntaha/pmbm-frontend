import React, { useEffect, useState } from "react";
import Content from "@/layout/content";
import Head from "@/layout/head";
import { Card } from "reactstrap";
import {
    Button,
    Block,
    BlockBetween,
    BlockDes,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Icon,
    Row,
    Col,
    ImageContainer,
} from "@/components";
import { Link, useParams } from "react-router-dom";
import type { InstitutionType } from "@/types";
import { show as showInstitution } from "@/common/api/institution"
import Activity from "./activity";
import Program from "@/pages/institution/detail/program";
import Period from "@/pages/institution/detail/period";
import { useAuthContext } from "@/common/hooks/useAuthContext";

const InstitutionDetails: React.FC = () => {
    const [institution, setInstitution] = useState<InstitutionType>();
    const { id } = useParams();
    const { user } = useAuthContext();

    useEffect(() => {
        let institutionId: number | undefined;
        if (user?.role === 2) {
            institutionId = user?.institutionId;
        } else {
            institutionId = Number(id);
        }
        if (institutionId !== undefined) {
            showInstitution({ id: institutionId }).then((resp) => {
                if (resp) setInstitution(resp)
            })
        }
    }, [id]);

    return (
        <React.Fragment>
            <Head title="Detail Lembaga" />
            {institution && (
                <Content>
                    <BlockHead size="sm">
                        <BlockBetween className="g-3">
                            <BlockHeadContent>
                                <BlockTitle page>
                                    Data / <strong className="text-primary small">{institution.surname}</strong>
                                </BlockTitle>
                                <BlockDes className="text-soft">
                                    <ul className="list-inline">
                                        <li>
                                            NPSN: <span className="text-base">{institution.npsn}</span>
                                        </li>
                                        <li>
                                            NSM: <span className="text-base">{institution.nsm}</span>
                                        </li>
                                    </ul>
                                </BlockDes>
                            </BlockHeadContent>

                            <BlockHeadContent>
                                <Link to={'/lembaga/data-lembaga'}>
                                    <Button color="light" outline className="bg-white d-none d-sm-inline-flex">
                                        <Icon name="arrow-left" />
                                        <span>Kembali</span>
                                    </Button>
                                    <Button color="light" outline className="btn-icon bg-white d-inline-flex d-sm-none">
                                        <Icon name="arrow-left" />
                                    </Button>
                                </Link>
                            </BlockHeadContent>
                        </BlockBetween>
                    </BlockHead>
                    <Block>
                        <BlockHead>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Informasi Lembaga</BlockTitle>
                                <p>Basic info, like name, phone, address, country etc.</p>
                            </BlockHeadContent>
                        </BlockHead>
                        <Row className="gy-5">
                            <Col md={8}>
                                <Card>
                                    <ul className="data-list is-compact">
                                        <li className="data-item">
                                            <div className="data-col">
                                                <div className="data-label">Nama Lembaga</div>
                                                <div className="data-value">{institution.name}</div>
                                            </div>
                                        </li>

                                        <li className="data-item">
                                            <div className="data-col">
                                                <div className="data-label">Nama Singkatan</div>
                                                <div className="data-value">{institution.surname}</div>
                                            </div>
                                        </li>
                                        <li className="data-item">
                                            <div className="data-col">
                                                <div className="data-label">Nomor Pokok Sekolah Nasional</div>
                                                <div className="data-value">{institution.npsn}</div>
                                            </div>
                                        </li>
                                        <li className="data-item">
                                            <div className="data-col">
                                                <div className="data-label">Nomor Statistik Madrasah</div>
                                                <div className="data-value">{institution.nsm}</div>
                                            </div>
                                        </li>

                                        <li className="data-item">
                                            <div className="data-col">
                                                <div className="data-label">Tagline</div>
                                                <div className="data-value">{institution.tagline}</div>
                                            </div>
                                        </li>

                                        <li className="data-item">
                                            <div className="data-col">
                                                <div className="data-label">Alamat</div>
                                                <div className="data-value text-soft">
                                                    <em>{institution.address}</em>
                                                </div>
                                            </div>
                                        </li>

                                        <li className="data-item">
                                            <div className="data-col">
                                                <div className="data-label">Nomor Telepon</div>
                                                <div className="data-value">{institution.phone}</div>
                                            </div>
                                        </li>

                                        <li className="data-item">
                                            <div className="data-col">
                                                <div className="data-label">Alamat Email</div>
                                                <div className="data-value">{institution.email}</div>
                                            </div>
                                        </li>

                                        <li className="data-item">
                                            <div className="data-col">
                                                <div className="data-label">Website</div>
                                                <div className="data-value">{institution.website}</div>
                                            </div>
                                        </li>

                                        <li className="data-item">
                                            <div className="data-col">
                                                <div className="data-label">Kepala Madrasah</div>
                                                <div className="data-value">{institution.head}</div>
                                            </div>
                                        </li>
                                    </ul>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card className="gallery">
                                    <ImageContainer img={institution.logo} />
                                </Card>
                            </Col>
                        </Row>
                    </Block>
                    <Block size="lg">
                        <Row className="gy-5">
                            <Col md={8}>
                                <Activity />
                            </Col>
                        </Row>
                    </Block>
                    <Block size="lg">
                        <Row className="gy-5">
                            <Col md={8}>
                                <Program />
                            </Col>
                        </Row>
                    </Block>
                    <Block size="lg">
                        <Row className="gy-5">
                            <Col md={8}>
                                <Period />
                            </Col>
                        </Row>
                    </Block>
                </Content>
            )}
        </React.Fragment>
    );
};

export default InstitutionDetails;
