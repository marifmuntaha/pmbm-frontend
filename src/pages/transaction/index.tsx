import React, {useState} from "react";
import Head from "@/layout/head";
import {Block, BlockBetween, BlockHead, BlockHeadContent, BlockTitle, Button, Icon, Row} from "@/components";
import Content from "@/layout/content";
import {useYearContext} from "@/common/hooks/useYearContext";
import {Card, Col} from "reactstrap";
import {formatCurrency} from "@/helpers";

const Transaction = () => {
    const year = useYearContext();
    const [sm, updateSm] = useState(false);
    return (
        <React.Fragment>
            <Head title="Data Transaksi" />
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Data Transaksi</BlockTitle>
                                <p>
                                    History Pembayaran Pendaftaran Penerimaan Murid Baru Tahun Ajaran {year?.name}
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
                                    <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                                        <ul className="nk-block-tools g-3">
                                            <li>
                                                <Button outline color="info" size="sm" onClick={() => alert('testing')}>
                                                    <Icon name="plus" /> <span>TAMBAH</span>
                                                </Button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </BlockHeadContent>
                        </BlockBetween>
                    </BlockHead>
                    <Row className="gy-4">
                        <Col md={4}>
                            <Card className="card-bordered border-primary">
                                <div className="card-inner">
                                    <div className="card-title-group align-start mb-2">
                                        <div className="card-title">
                                            <h6 className="title text-soft">TOTAL TRANSAKSI</h6>
                                        </div>
                                        <div className="card-tools">
                                            <Icon name="coins" className="text-primary fs-4" />
                                        </div>
                                    </div>
                                    <div className="align-end flex-wrap g-3 justify-between">
                                        <div className="data">
                                            <div className="amount fw-bold">Rp. 100.000.000</div>
                                            <div className="info">Total Transaksi</div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="card-bordered border-primary">
                                <div className="card-inner">
                                    <div className="card-title-group align-start mb-2">
                                        <div className="card-title">
                                            <h6 className="title text-soft">TRANSAKSI HARI INI</h6>
                                        </div>
                                        <div className="card-tools">
                                            <Icon name="coins" className="text-primary fs-4" />
                                        </div>
                                    </div>
                                    <div className="align-end flex-wrap g-3 justify-between">
                                        <div className="data">
                                            <div className="amount fw-bold">Rp. 100.000.000</div>
                                            <div className="info">Total Transaksi</div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="card-bordered border-primary">
                                <div className="card-inner">
                                    <div className="card-title-group align-start mb-2">
                                        <div className="card-title">
                                            <h6 className="title text-soft">TRANSAKSI SAYA</h6>
                                        </div>
                                        <div className="card-tools">
                                            <Icon name="coins" className="text-primary fs-4" />
                                        </div>
                                    </div>
                                    <div className="align-end flex-wrap g-3 justify-between">
                                        <div className="data">
                                            <div className="amount fw-bold">Rp. 100.000.000</div>
                                            <div className="info">Total Transaksi</div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Block>
            </Content>
        </React.Fragment>
    )
}

export default Transaction