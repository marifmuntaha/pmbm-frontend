import React, { useEffect, useState } from "react";
import Head from "@/layout/head";
import Content from "@/layout/content";
import { Block, BlockHead, BlockHeadContent, BlockTitle, BlockDes, Row, Col, Icon, Button, PreviewCard, FlowSkeleton } from "@/components";
import { Card } from "reactstrap";
import { Link } from "react-router-dom";

const Flow = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const steps = [
        {
            id: 1,
            title: "Buat Akun",
            description: "Daftarkan diri Anda dengan membuat akun baru. Pastikan email dan nomor HP yang digunakan aktif untuk verifikasi dan notifikasi.",
            icon: "user-add",
            color: "primary"
        },
        {
            id: 2,
            title: "Lengkapi Biodata",
            description: "Isi formulir pendaftaran dengan data diri, data orang tua, dan data asal sekolah yang lengkap dan benar sesuai dokumen asli.",
            icon: "file-doc",
            color: "info"
        },
        {
            id: 3,
            title: "Pembayaran Biaya",
            description: "Lakukan pembayaran biaya pendaftaran melalui metode pembayaran yang tersedia (Transfer Bank / Tunai di Sekolah).",
            icon: "wallet",
            color: "success"
        },
        {
            id: 4,
            title: "Ujian Seleksi",
            description: "Ikuti ujian seleksi masuk sesuai jadwal yang telah ditentukan oleh panitia PPDB. Persiapkan diri Anda sebaik mungkin.",
            icon: "edit",
            color: "warning"
        },
        {
            id: 5,
            title: "Pengumuman & Daftar Ulang",
            description: "Pantau hasil seleksi melalui dashboard akun Anda. Jika diterima, segera lakukan daftar ulang untuk meresmikan status santri.",
            icon: "bell",
            color: "danger"
        }
    ];

    const requirements = [
        { icon: "file-text", text: "Kartu Keluarga (KK)" },
        { icon: "user", text: "Akte Kelahiran" },
        { icon: "img", text: "Pas Foto Terbaru" },
        { icon: "book", text: "Rapor Sekolah Asal" },
    ];

    if (loading) {
        return <FlowSkeleton />;
    }

    return (
        <React.Fragment>
            <Head title="Alur Pendaftaran" />
            <Content page="component">
                <BlockHead size="lg" className="text-center">
                    <BlockHeadContent>
                        <BlockTitle page>Alur Pendaftaran Santri Baru</BlockTitle>
                        <BlockDes className="text-soft">
                            <p>Panduan lengkap langkah demi langkah untuk bergabung bersama kami.</p>
                        </BlockDes>
                    </BlockHeadContent>
                </BlockHead>

                <Block>
                    <div className="timeline-zigzag">
                        {steps.map((step, index) => (
                            <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                                <div className={`timeline-icon bg-${step.color} text-white`}>
                                    <Icon name={step.icon} />
                                </div>
                                <div className="timeline-content">
                                    <Card className={`card-bordered border-${step.color} shadow-sm h-100`}>
                                        <div className="card-inner">
                                            <div className="d-flex align-items-center mb-3">
                                                <span className={`badge bg-${step.color} rounded-pill me-2`}>Langkah {step.id}</span>
                                                <h5 className={`title text-${step.color} mb-0`}>{step.title}</h5>
                                            </div>
                                            <p className="text-soft">{step.description}</p>
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
                            <PreviewCard className="h-100 bg-primary text-white">
                                <div className="card-inner">
                                    <div className="align-center flex-wrap flex-md-nowrap g-4">
                                        <div className="media media-lg media-middle media-circle text-primary bg-white">
                                            <Icon name="files" />
                                        </div>
                                        <div className="media-content">
                                            <h4 className="title text-white">Persyaratan Dokumen</h4>
                                            <p className="text-white-50">Siapkan dokumen-dokumen berikut sebelum melakukan pendaftaran agar proses lebih lancar:</p>
                                            <ul className="list-checked list-checked-white row g-3 mt-2">
                                                {requirements.map((req, idx) => (
                                                    <li className="col-sm-6" key={idx}>{req.text}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </PreviewCard>
                        </Col>
                        <Col lg={6}>
                            <PreviewCard className="h-100 bg-lighter">
                                <div className="card-inner">
                                    <div className="align-center flex-wrap flex-md-nowrap g-4">
                                        <div className="media media-lg media-middle media-circle text-info bg-white">
                                            <Icon name="help" />
                                        </div>
                                        <div className="media-content">
                                            <h4 className="title text-dark">Butuh Bantuan?</h4>
                                            <p className="text-soft">Jika Anda mengalami kesulitan atau memiliki pertanyaan seputar pendaftaran, jangan ragu untuk menghubungi panitia kami.</p>
                                            <div className="mt-3">
                                                <Button color="primary" outline className="btn-dim me-2">Hubungi Kami</Button>
                                                <Link to="/auth/faq">
                                                    <Button color="light" className="btn-white">Lihat FAQ</Button>
                                                </Link>
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
                        <div className="card-inner">
                            <h3 className="title">Siap untuk Mendaftar?</h3>
                            <p className="lead text-soft">Segera daftarkan putra-putri Anda sebelum kuota terpenuhi.</p>
                            <Link to="/auth/register">
                                <Button size="lg" color="primary" className="mt-3">
                                    Daftar Sekarang <Icon name="arrow-right" className="ms-1" />
                                </Button>
                            </Link>
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

export default Flow;
