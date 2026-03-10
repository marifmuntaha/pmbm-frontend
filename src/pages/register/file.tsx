import React, { useEffect, useState } from "react";
import Head from "@/layout/head";
import Content from "@/layout/content";
import { Block, BlockHead, BlockHeadContent, BlockTitle, Col, Icon, PreviewCard, Row } from "@/components";
import { useAuthContext } from "@/common/hooks/useAuthContext";
import StudentFileForm from "@/components/pages/student/form/file";
import { Button, Card, CardHeader, Spinner } from "reactstrap";
import { get as getFile, store as storeFile, update as updateFile } from "@/common/api/student/file";
import { useForm, useWatch } from "react-hook-form";
import type { StudentFileFormType, StudentFileType } from "@/types";
import { useNavigate } from "react-router-dom";

const StudentFile = () => {
    const methods = useForm<StudentFileFormType>();
    const { user } = useAuthContext()
    const { control, handleSubmit, setValue } = methods;
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState<StudentFileType>();
    const navigate = useNavigate();
    const id = useWatch({ control, name: 'id' });
    const onSubmit = (values: StudentFileFormType) => {
        setLoading(true)
        const formData: StudentFileFormType = {
            ...values,
            id: file?.id ? file.id : undefined,
            userId: user?.id,
            imagePhoto: values.imagePhoto[0],
            imageKk: values.imageKk[0],
            imageKtp: values.imageKtp[0],
            imageAkta: values.imageAkta[0],
            imageIjazah: values.imageIjazah[0],
            imageSkl: values.imageSkl[0],
            imageKip: values.imageKip[0],
        }
        if (file?.id) updateFile(formData).finally(() => setLoading(false))
        else storeFile(formData).then((resp) => setValue('id', resp?.id))
            .finally(() => setLoading(false))
    }
    useEffect(() => {
        getFile({ userId: user?.id }).then((resp) => {
            if (resp.length > 0) {
                const result = resp[0]
                setValue('id', result.id)
                setValue('numberAkta', result.numberAkta)
                setValue('numberIjazah', result.numberIjazah)
                setValue('numberSkl', result.numberSkl)
                setValue('numberKip', result.numberKip)
                setFile(result);
            }
        })
    }, []);

    return (
        <React.Fragment>
            <Head title="Unggah Berkas" />
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockHeadContent>
                            <BlockTitle tag="h5">Unggah Berkas</BlockTitle>
                            <p>
                                Textual form controls—like <code className="code-tag">&lt;input&gt;</code>s,{" "}
                                <code className="code-tag">&lt;select&gt;</code>s, and{" "}
                            </p>
                        </BlockHeadContent>
                    </BlockHead>
                </Block>
                <Row className="gy-0 mt-3">
                    <Col md={8}>
                        <PreviewCard>
                            <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                                <StudentFileForm methods={methods} file={file} />
                                <div className="form-group between-center">
                                    <Button color="primary" type="submit" disabled={loading} className="me-2">
                                        {loading ? (<Spinner size="sm" />) : (
                                            <React.Fragment><Icon name="save" /> <span>SIMPAN</span></React.Fragment>
                                        )}
                                    </Button>
                                    {id !== undefined && (
                                        <Button color="light" type="button" onClick={() => navigate('/pembayaran')}>
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
                                    <h6 className="lead-text text-primary">1. Ketentuan Foto</h6>
                                    <ul className="list list-sm list-checked small">
                                        <li>Format file yang diperbolehkan: <strong>JPG, JPEG, PNG</strong>.</li>
                                        <li>Ukuran maksimal setiap file adalah <strong>1MB</strong>.</li>
                                        <li>Pastikan foto/hasil scan terlihat jelas dan terbaca.</li>
                                    </ul>
                                </div>

                                <div className="mb-3">
                                    <h6 className="lead-text text-primary">2. Dokumen Wajib</h6>
                                    <ul className="list list-sm list-checked small">
                                        <li><strong>Pas Foto</strong>: Foto resmi siswa (latar belakang merah/biru).</li>
                                        <li><strong>Kartu Keluarga (KK)</strong>: Scan asli KK terbaru.</li>
                                        <li><strong>KTP Wali</strong>: Scan asli KTP orang tua/wali.</li>
                                        <li><strong>Akta Kelahiran</strong>: Scan asli akta kelahiran siswa.</li>
                                    </ul>
                                </div>

                                <div className="mb-3">
                                    <h6 className="lead-text text-primary">3. Dokumen Pendukung</h6>
                                    <ul className="list list-sm list-checked small">
                                        <li><strong>Ijazah/SKL</strong>: Jika sudah ada (untuk pendaftar jenjang lanjutan).</li>
                                        <li><strong>KIP/PKH/KKS</strong>: Jika memiliki kartu bantuan sosial.</li>
                                    </ul>
                                </div>

                                <div className="alert alert-icon alert-info mt-3" role="alert">
                                    <Icon name="alert-circle" />
                                    <strong>Info</strong>. Dokumen yang diunggah akan diverifikasi oleh panitia PPDB.
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </React.Fragment>
    )
}

export default StudentFile;