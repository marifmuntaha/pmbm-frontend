import React, { useEffect, useState } from "react";
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
import StudentOriginForm from "@/components/pages/student/form/origin";
import { useAuthContext } from "@/common/hooks/useAuthContext";
import { Card, CardHeader, Spinner } from "reactstrap";
import { useForm, useWatch } from "react-hook-form";
import type { StudentOriginType } from "@/types";
import { useNavigate } from "react-router-dom";
import { get as getOrigin, store as storeOrigin, update as updateOrigin } from "@/common/api/student/origin";

const StudentOrigin = () => {
    const year = useYearContext()
    const methods = useForm<StudentOriginType>();
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { control, handleSubmit, setValue } = methods;
    const [sm, updateSm] = useState(false)
    const [loading, setLoading] = useState(false);
    const id = useWatch({ control, name: 'id' })
    const onSubmit = (values: StudentOriginType) => {
        setLoading(true)
        const formData: StudentOriginType = {
            ...values,
            userId: user?.id
        }
        if (formData.id === undefined) {
            storeOrigin(formData).then((resp) => setValue('id', resp?.id))
                .finally(() => setLoading(false))
        } else {
            updateOrigin(formData).finally(() => setLoading(false))
        }
    }

    useEffect(() => {
        getOrigin({ userId: user?.id }).then((resp) => {
            if (resp.length > 0) {
                const result = resp[0]
                setValue('id', result?.id)
                setValue('name', result.name)
                setValue('npsn', result.npsn)
                setValue('address', result.address)
            }
            else return
        })
    }, [user]);
    return (
        <React.Fragment>
            <Head title="Data Sekolah Asal" />
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Data Sekolah Asal</BlockTitle>
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
                                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                                    <StudentOriginForm methods={methods} />
                                    <div className="form-group between-center">
                                        <Button color="primary" type="submit" disabled={loading} className="me-2">
                                            {loading ? (<Spinner size="sm" />) : (
                                                <React.Fragment><Icon name="save" /> <span>SIMPAN</span></React.Fragment>
                                            )}
                                        </Button>
                                        {id !== undefined && (
                                            <Button color="light" type="button" onClick={() => navigate('/pendaftaran/data-prestasi')}>
                                                <React.Fragment><Icon name="chevron-right-c" /> <span>LANJUT</span></React.Fragment>
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            </PreviewCard>
                        </Col>
                        <Col md={4}>
                            <Card className="border-1">
                                <CardHeader className="border-bottom">
                                    <h6>Panduan Pengisian</h6>
                                </CardHeader>
                                <div className="card-inner">
                                    <div className="mb-3">
                                        <h6 className="lead-text text-primary">1. Nama Sekolah</h6>
                                        <ul className="list list-sm list-checked small">
                                            <li>Isi <strong>Nama Sekolah</strong> asal dengan lengkap dan benar (tanpa singkatan jika memungkinkan).</li>
                                            <li>Contoh: <strong>MI Darul Hikmah</strong>, <strong>SDN 1 Menganti</strong>.</li>
                                        </ul>
                                    </div>

                                    <div className="mb-3">
                                        <h6 className="lead-text text-primary">2. NPSN</h6>
                                        <ul className="list list-sm list-checked small">
                                            <li><strong>NPSN</strong> (Nomor Pokok Sekolah Nasional) terdiri dari 8 digit angka. <span className="text-muted ff-italic">(Jika tidak tahu, silahkan kosongkan)</span></li>
                                            <li>Pastikan NPSN sesuai dengan data Dapodik/EMIS sekolah asal.</li>
                                        </ul>
                                    </div>

                                    <div className="mb-3">
                                        <h6 className="lead-text text-primary">3. Alamat Sekolah</h6>
                                        <ul className="list list-sm list-checked small">
                                            <li>Tuliskan <strong>Alamat Sekolah</strong> lengkap (Jalan, RT/RW, Desa, Kecamatan).</li>
                                        </ul>
                                    </div>

                                    <div className="alert alert-icon alert-info mt-3" role="alert">
                                        <Icon name="alert-circle" />
                                        <strong>Info</strong>. Data sekolah asal penting untuk administrasi kelulusan & pendaftaran.
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

export default StudentOrigin;