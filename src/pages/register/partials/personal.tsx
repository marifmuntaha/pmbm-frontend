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
import StudentPersonalForm from "@/components/pages/student/form/personal";
import { useAuthContext } from "@/common/hooks/useAuthContext";
import { Card, CardHeader, Spinner } from "reactstrap";
import { useForm, useWatch } from "react-hook-form";
import type { StudentPersonalFormType, StudentPersonalType } from "@/types";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { get as getPersonal, store as storePersonal, update as updatePersonal } from "@/common/api/student/personal";

const StudentPersonal = () => {
    const year = useYearContext()
    const { user } = useAuthContext()
    const methods = useForm<StudentPersonalFormType>()
    const { control, handleSubmit, setValue } = methods
    const [sm, updateSm] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const onSubmit = (values: StudentPersonalFormType) => {
        setLoading(true)
        const formData: StudentPersonalType = {
            ...values,
            userId: user?.id,
            birthDate: moment(values.birthDate).format("YYYY-MM-DD"),
        }
        if (formData.id === undefined) {
            storePersonal(formData).then((resp) => setValue('id', resp?.id))
                .finally(() => setLoading(false))
        } else {
            updatePersonal(formData).finally(() => setLoading(false))
        }
    }
    const id = useWatch({ control, name: 'id' })

    useEffect(() => {
        getPersonal({ userId: user?.id }).then((resp) => {
            if (resp.length > 0) {
                const result = resp[0]
                setValue('id', result?.id)
                setValue('name', result.name)
                setValue('nisn', result.nisn)
                setValue('nik', result.nik)
                setValue('gender', result.gender)
                setValue('birthPlace', result.birthPlace)
                setValue('birthDate', moment(result.birthDate, 'YYYY-MM-DD').toDate())
                setValue('phone', result.phone)
                setValue('birthNumber', result.birthNumber)
                setValue('sibling', result.sibling)
            }
            else return
        })
    }, [user]);
    return (
        <React.Fragment>
            <Head title="Data Pribadi" />
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Data Pribadi</BlockTitle>
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
                    <Row className="gy-4">
                        <Col md={8}>
                            <PreviewCard className="border-1">
                                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                                    <StudentPersonalForm methods={methods} />
                                    <div className="form-group between-center mt-3">
                                        <Button color="primary" type="submit" disabled={loading} className="me-2">
                                            {loading ? (<Spinner size="sm" />) : (
                                                <React.Fragment><Icon name="save" /> <span>SIMPAN</span></React.Fragment>
                                            )}
                                        </Button>
                                        {id !== undefined && (
                                            <Button color="light" type="button" onClick={() => navigate('/pendaftaran/data-orangtua')}>
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
                                        <h6 className="lead-text text-primary">1. Identitas Diri</h6>
                                        <ul className="list list-sm list-checked small">
                                            <li><strong>Nama Lengkap</strong> wajib sesuai dengan Ijazah atau Akta Kelahiran.</li>
                                            <li>Pilih <strong>Jenis Kelamin</strong> sesuai dokumen resmi (Laki-laki/Perempuan).</li>
                                            <li>Pastikan <strong>Tempat & Tanggal Lahir</strong> sama persis dengan akta.</li>
                                        </ul>
                                    </div>
                                    <div className="mb-3">
                                        <h6 className="lead-text text-primary">2. Dokumen Kependudukan</h6>
                                        <ul className="list list-sm list-checked small">
                                            <li><strong>NIK</strong> wajib 16 digit sesuai Kartu Keluarga (KK).</li>
                                            <li><strong>NISN</strong> (Nomor Induk Siswa Nasional) dari sekolah asal. <span className="text-muted ff-italic">Kosongkan jika tidak tahu.</span></li>
                                        </ul>
                                    </div>
                                    <div className="mb-3">
                                        <h6 className="lead-text text-primary">3. Kontak & Lainnya</h6>
                                        <ul className="list list-sm list-checked small">
                                            <li>Nomor <strong>Handphone (WA)</strong> wajib aktif untuk info/pengumuman.</li>
                                            <li>Isi <strong>Anak ke-</strong> berapa dan total <strong>Jumlah Saudara</strong> (kandung/tiri/angkat).</li>
                                        </ul>
                                    </div>
                                    <div className="alert alert-icon alert-warning mt-3" role="alert">
                                        <Icon name="alert-circle" />
                                        <strong>Penting</strong>. Pastikan data diri (terutama NIK & Nama) valid agar tidak bermasalah di Dapodik.
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

export default StudentPersonal;