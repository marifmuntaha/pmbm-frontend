import React, { useEffect, useState } from "react";
import Head from "@/layout/head";
import Content from "@/layout/content";
import { Block, BlockHead, BlockHeadContent, BlockTitle, BlockDes, PreviewCard, Row, Col, Icon, BlockBetween, GuestSkeleton } from "@/components";
import { Card } from "reactstrap";
import { Link } from "react-router-dom";
import { landing } from "@/common/api/public";
import type { LandingDataType } from "@/types";
import moment from "moment/moment";

const Guest = () => {
    const [data, setData] = useState<LandingDataType | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const getData = async () => {
            await landing().then((res) => {
                if (res) {
                    setData(res);
                }
            }).catch((e) => {
                console.log(e);
            }).finally(() => {
                setLoading(false);
            });
        }
        getData();
    }, []);

    const filteredRegistrants = data?.registrants.filter(reg =>
        reg.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <GuestSkeleton />;
    }

    return (
        <React.Fragment>
            <Head title="Beranda" />
            <Content>
                <Row className="gy-2">
                    <Col md={12}>
                        <PreviewCard className="bg-blue text-white text-center py-4">
                            <h2 className="text-white mb-3">Selamat Datang di PMBM Yayasan Darul Hikmah {data?.year}</h2>
                            <p className="lead text-white-50 mb-4">
                                Bergabunglah bersama kami di tahun ajaran ini. Segera daftarkan putra-putri Anda!
                            </p>
                            <Link to="/auth/buat-akun" className="btn btn-lg btn-dim btn-lighter text-blue">
                                Daftar Sekarang
                            </Link>
                        </PreviewCard>
                    </Col>
                </Row>
                <BlockHead size="sm" className="mt-5">
                    <BlockHeadContent>
                        <BlockTitle tag="h5">Statistik Pendaftar & Informasi Periode</BlockTitle>
                        <BlockDes>
                            <p>Statistik pendaftar setiap jenjang lembaga.</p>
                        </BlockDes>
                    </BlockHeadContent>
                </BlockHead>
                <Row className="gy-2">
                    {data?.institutions.map((inst) => (
                        <Col sm={6} md={3} key={inst.id}>
                            <Card className="card-bordered h-100">
                                <div className="card-inner">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="user-avatar lg bg-transparent border me-3">
                                            <img src={inst.logo} alt="" />
                                        </div>
                                        <div>
                                            <h5 className="title mb-1">{inst.surname}</h5>
                                            <span className="sub-text">Pendaftar: {inst.registrants_count}</span>
                                        </div>
                                    </div>
                                    {inst.period ? (
                                        <div className="alert alert-success alert-icon">
                                            <Icon name="check-circle" />
                                            <strong>Pendaftaran Dibuka</strong>
                                            <div className="small mt-1">
                                                Gelombang: {inst.period.name} <br />
                                                Sampai: {moment(inst.period.end).format('DD MMMM YYYY')}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="alert alert-warning alert-icon">
                                            <Icon name="alert-circle" />
                                            <strong>Pendaftaran Belum Dibuka</strong>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
                <BlockHead size="sm" className="mt-5">
                    <BlockHeadContent>
                        <BlockTitle tag="h5">Brosur & Informasi</BlockTitle>
                        <BlockDes>
                            <p>Unduh brosur informasi pendaftaran untuk setiap lembaga.</p>
                        </BlockDes>
                    </BlockHeadContent>
                </BlockHead>
                <Row className="gy-2">
                    {data?.brochures && data.brochures.length > 0 ? (
                        data.brochures.map((brochure) => (
                            <Col md={6} lg={3} key={brochure.id}>
                                <Card className="card-bordered">
                                    <div className="card-inner">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                <div className="user-avatar md bg-transparent border me-3">
                                                    <img src={brochure.institution.logo} alt={brochure.institution.surname} />
                                                </div>
                                                <div>
                                                    <h6 className="title mb-0">{brochure.institution.surname}</h6>
                                                    <span className="sub-text">Brosur Pendaftaran</span>
                                                </div>
                                            </div>
                                            <a href={brochure.brochure} target="_blank" rel="noopener noreferrer" className="btn btn-icon bg-blue text-white btn-sm">
                                                <Icon name="download" />
                                            </a>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col md={12}>
                            <div className="alert alert-light border text-center">Belum ada brosur yang tersedia.</div>
                        </Col>
                    )}
                </Row>
                <BlockHead size="sm" className="mt-5">
                    <BlockBetween className="g-3">
                        <BlockHeadContent>
                            <BlockTitle tag="h5">Data Pendaftar</BlockTitle>
                            <BlockDes>
                                <p>Daftar calon siswa yang baru saja mendaftar.</p>
                            </BlockDes>
                        </BlockHeadContent>
                        <div className="form-group">
                            <div className="form-control-wrap">
                                <div className="form-icon form-icon-right">
                                    <Icon name="search" />
                                </div>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="default-04"
                                    placeholder="Cari Nama Siswa..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </BlockBetween>
                </BlockHead>
                <Row>
                    <Block>
                        <Card className="card-bordered card-preview">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="tb-col-os"><span className="overline-title">Lembaga</span></th>
                                            <th className="tb-col-ip"><span className="overline-title">Nama Calon Siswa</span></th>
                                            <th className="tb-col-time"><span className="overline-title">Wali</span></th>
                                            <th className="tb-col-time"><span className="overline-title">Alamat</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRegistrants && filteredRegistrants.length > 0 ? (
                                            filteredRegistrants.map((reg) => (
                                                <tr key={reg.id}>
                                                    <td className="tb-col-os">{reg.institution}</td>
                                                    <td className="tb-col-ip"><span className="fw-bold text-blue">{reg.name}</span></td>
                                                    <td className="tb-col-time">{reg.guardian}</td>
                                                    <td className="tb-col-time">{reg.address}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="text-center p-3">
                                                    {searchQuery ? "Data tidak ditemukan." : "Belum ada data pendaftar."}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </Block>
                </Row>
            </Content>
        </React.Fragment >
    );
};

export default Guest;
