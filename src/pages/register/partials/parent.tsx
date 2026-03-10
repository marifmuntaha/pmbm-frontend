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
import { useAuthContext } from "@/common/hooks/useAuthContext";
import StudentParentForm from "@/components/pages/student/form/parent";
import { useForm, useWatch } from "react-hook-form";
import type { StudentParentFormType, StudentParentType } from "@/types";
import moment from "moment";
import { store as storeParent, update as updateParent } from "@/common/api/student/parent";
import { get as getParent } from "@/common/api/student/parent";
import {
    GUARD_STATUS_OPTIONS,
    PARENT_JOB_OPTIONS,
    PARENT_STATUS_OPTIONS,
    PARENT_STUDY_OPTIONS
} from "@/common/constants";
import { Card, CardHeader, Spinner } from "reactstrap";
import { useNavigate } from "react-router-dom";

const StudentParent = () => {
    const year = useYearContext()
    const methods = useForm<StudentParentFormType>()
    const { control, handleSubmit, setValue } = methods;
    const { user } = useAuthContext()
    const [sm, updateSm] = useState(false)
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const id = useWatch({ control, name: 'id' })
    const onSubmit = (values: StudentParentFormType) => {
        setLoading(true)
        const formData: StudentParentType = {
            ...values,
            userId: user?.id,
            fatherStatus: values.fatherStatus ? values.fatherStatus.value : 0,
            fatherBirthDate: moment(values.fatherBirthDate).format("YYYY-MM-DD"),
            fatherStudy: values.fatherStudy ? values.fatherStudy.value : 0,
            fatherJob: values.fatherJob ? values.fatherJob.value : 0,
            motherStatus: values.motherStatus ? values.motherStatus.value : 0,
            motherBirthDate: moment(values.motherBirthDate).format("YYYY-MM-DD"),
            motherStudy: values.motherStudy ? values.motherStudy.value : 0,
            motherJob: values.motherJob ? values.motherJob.value : 0,
            motherPhone: values.motherPhone,
            guardStatus: values.guardStatus ? values.guardStatus.value : 0,
            guardBirthDate: moment(values.guardBirthDate).format("YYYY-MM-DD"),
            guardStudy: values.guardStudy ? values.guardStudy.value : 0,
            guardJob: values.guardJob ? values.guardJob.value : 0,
        }
        if (formData.id === undefined) {
            storeParent(formData).then((resp) => setValue('id', resp?.id))
                .finally(() => setLoading(false))
        } else {
            updateParent(formData).finally(() => setLoading(false))
        }
    }

    useEffect(() => {
        getParent({ userId: user?.id }).then((resp) => {
            if (resp.length > 0) {
                const result = resp[0]
                setValue('id', result?.id)
                setValue('numberKk', result.numberKk)
                setValue('headFamily', result.headFamily)
                setValue('fatherStatus', PARENT_STATUS_OPTIONS.find((item) => item.value === result.fatherStatus))
                setValue('fatherName', result.fatherName)
                setValue('fatherNik', result.fatherNik)
                setValue('fatherBirthPlace', result.fatherBirthPlace)
                setValue('fatherBirthDate', moment(result.fatherBirthDate, 'YYYY-MM-DD').toDate())
                setValue('fatherStudy', PARENT_STUDY_OPTIONS.find((item) => item.value === result.fatherStudy))
                setValue('fatherJob', PARENT_JOB_OPTIONS.find((item) => item.value === result.fatherJob))
                setValue('fatherPhone', result.fatherPhone)
                setValue('motherStatus', PARENT_STATUS_OPTIONS.find((item) => item.value === result.motherStatus))
                setValue('motherName', result.motherName)
                setValue('motherNik', result.motherNik)
                setValue('motherBirthPlace', result.motherBirthPlace)
                setValue('motherBirthDate', moment(result.motherBirthDate, 'YYYY-MM-DD').toDate())
                setValue('motherStudy', PARENT_STUDY_OPTIONS.find((item) => item.value === result.motherStudy))
                setValue('motherJob', PARENT_JOB_OPTIONS.find((item) => item.value === result.motherJob))
                setValue('motherPhone', result.motherPhone)
                setValue('guardStatus', GUARD_STATUS_OPTIONS.find((item) => item.value === result.guardStatus))
                setValue('guardName', result.guardName)
                setValue('guardNik', result.guardNik)
                setValue('guardBirthPlace', result.guardBirthPlace)
                setValue('guardBirthDate', moment(result.guardBirthDate, 'YYYY-MM-DD').toDate())
                setValue('guardStudy', PARENT_STUDY_OPTIONS.find((item) => item.value === result.guardStudy))
                setValue('guardJob', PARENT_JOB_OPTIONS.find((item) => item.value === result.guardJob))
                setValue('guardPhone', result.guardPhone)
            } else return
        })
    }, [user]);

    return (
        <React.Fragment>
            <Head title="Data Orangtua" />
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Data Orangtua</BlockTitle>
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
                                    <StudentParentForm methods={methods} />
                                    <Col md={12} className="mt-4">
                                        <div className="form-group between-center">
                                            <Button color="primary" type="submit" disabled={loading} className="me-2">
                                                {loading ? (<Spinner size="sm" />) : (
                                                    <React.Fragment><Icon name="save" /> <span>SIMPAN</span></React.Fragment>
                                                )}
                                            </Button>
                                            {id !== undefined && (
                                                <Button color="light" type="button" onClick={() => navigate('/pendaftaran/data-tempat-tinggal')}>
                                                    <React.Fragment><Icon name="chevron-right-c" /> <span>LANJUT</span></React.Fragment>
                                                </Button>
                                            )}
                                        </div>
                                    </Col>
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
                                        <h6 className="lead-text text-primary">1. Kartu Keluarga (KK)</h6>
                                        <ul className="list list-sm list-checked small">
                                            <li>Isi <strong>Nomor KK</strong> (16 digit) sesuai yang tertera di bagian atas kartu.</li>
                                            <li><strong>Kepala Keluarga</strong> diisi nama lengkap kepala keluarga sesuai KK.</li>
                                        </ul>
                                    </div>

                                    <div className="mb-3">
                                        <h6 className="lead-text text-primary">2. Identitas Orangtua (Ayah & Ibu)</h6>
                                        <ul className="list list-sm list-checked small">
                                            <li>Pilih <strong>Status</strong> (Hidup/Meninggal/Tidak Diketahui).</li>
                                            <li>Nama & NIK wajib sesuai KTP/KK (Jika masih hidup).</li>
                                            <li>Lengkapi data pendidikan, pekerjaan, dan penghasilan (Jika masih hidup).</li>
                                        </ul>
                                    </div>

                                    <div className="mb-3">
                                        <h6 className="lead-text text-primary">3. Kontak & Wali</h6>
                                        <ul className="list list-sm list-checked small">
                                            <li>Wali <strong>HANYA</strong> diisi jika siswa wali siswa tidak sama dengan ayah/ibu kandung.</li>
                                            <li>Nomor <strong>Handphone (WA)</strong> Wali wajib aktif untuk komunikasi madrasah.</li>
                                        </ul>
                                    </div>

                                    <div className="alert alert-icon alert-warning mt-3" role="alert">
                                        <Icon name="alert-circle" />
                                        <strong>Penting</strong>. Data orangtua digunakan untuk keperluan administrasi, pemberkasan, dan kontak darurat.
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

export default StudentParent;