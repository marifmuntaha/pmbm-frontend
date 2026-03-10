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
import { useYearContext } from "@/common/hooks/useYearContext";
import StudentAchievementForm from "@/components/pages/student/form/achievement";
import { useAuthContext } from "@/common/hooks/useAuthContext";
import { Card, CardHeader } from "reactstrap";

const StudentAchievement = () => {
    const { user } = useAuthContext();
    const year = useYearContext()
    const [sm, updateSm] = useState(false)
    return (
        <React.Fragment>
            <Head title="Data Prestasi" />
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Data Prestasi</BlockTitle>
                                <p>Penerimaan Murid Baru Yayasan Darul Hikmah Menganti Tahun Ajaran {year?.name}</p>
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
                        <Col md={8}>
                            <PreviewCard>
                                <StudentAchievementForm user={user} />
                            </PreviewCard>
                        </Col>
                        <Col md={4}>
                            <Card className="border-1">
                                <CardHeader className="border-bottom">
                                    <h6>Panduan Pengisian</h6>
                                </CardHeader>
                                <div className="card-inner">
                                    <div className="mb-3">
                                        <h6 className="lead-text text-primary">1. Tambah Data</h6>
                                        <ul className="list list-sm list-checked small">
                                            <li>Klik tombol <strong>Tambah</strong> untuk memasukkan data prestasi.</li>
                                            <li>Anda dapat memasukkan lebih dari satu prestasi.</li>
                                        </ul>
                                    </div>

                                    <div className="mb-3">
                                        <h6 className="lead-text text-primary">2. Detail Prestasi</h6>
                                        <ul className="list list-sm list-checked small">
                                            <li>Isi <strong>Nama Kegiatan</strong>, <strong>Jenis</strong> (Akademik/Non), <strong>Tingkat</strong>, dan <strong>Juara</strong>.</li>
                                            <li>Upload bukti <strong>Sertifikat/Piagam</strong> (Maks. 2MB).</li>
                                        </ul>
                                    </div>

                                    <div className="alert alert-icon alert-info mt-3" role="alert">
                                        <Icon name="alert-circle" />
                                        <strong>Info</strong>. Jika tidak memiliki prestasi, silakan langsung klik tombol <strong>LANJUT</strong>.
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

export default StudentAchievement;