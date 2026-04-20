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
import StudentProgramForm from "@/components/pages/student/form/program";
import { useAuthContext } from "@/common/hooks/useAuthContext";
import { Card, CardHeader, Spinner } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import type { InstitutionPeriodType, StudentProgramType } from "@/types";
import { get as getProgram, store as storeProgram, update as updateProgram } from "@/common/api/student/program";
import { update as updateUser } from "@/common/api/user";
import { get as getPeriod } from "@/common/api/institution/period";
import moment from "moment";

const StudentProgram = () => {
    const year = useYearContext()
    const navigate = useNavigate()
    const methods = useForm<StudentProgramType>({})
    const { user } = useAuthContext()
    const { control, handleSubmit, setValue } = methods
    const [sm, updateSm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [period, setPeriod] = useState<InstitutionPeriodType>()

    const id = useWatch({ control, name: 'id' })

    const onSubmit = (values: StudentProgramType) => {
        setLoading(true)
        const formData: StudentProgramType = {
            ...values,
            id: values.id,
            userId: user?.id,
            yearId: year?.id,
            periodId: period?.id,
            status: 1
        }
        if (formData.id === undefined) {
            storeProgram(formData).then(async (resp) => {
                setValue('id', resp?.id)
                await updateUser({ id: user?.id, institutionId: values.institutionId }, false)
            }).finally(() => setLoading(false))
        } else {
            updateProgram(formData).then(async () => {
                await updateUser({ id: user?.id, institutionId: values.institutionId }, false)
            }).finally(() => setLoading(false))
        }
    }

    useEffect(() => {
        getProgram({ userId: user?.id }).then((resp) => {
            if (resp.length > 0) {
                const result = resp[0]
                setValue('id', result?.id)
                setValue('userId', user?.id)
                setValue('institutionId', result ? result.institutionId : user?.institutionId)
                setValue('programId', result?.programId)
                setValue('boardingId', result?.boardingId)
            } else return
        })

        getPeriod<InstitutionPeriodType>({
            yearId: year?.id,
            institutionId: user?.institutionId,
            date: moment().format('YYYY-MM-DD')
        }).then((resp) => {
            const result = resp[0]
            setPeriod(result)
            setValue('periodId', result.id)
        })

    }, [user]);

    return (
        <React.Fragment>
            <Head title="Data Program Pilihan" />
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Program Pilihan</BlockTitle>
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
                                    <StudentProgramForm methods={methods} user={user} setPeriod={setPeriod} />
                                    <div className="form-group between-center">
                                        <Button color="primary" type="submit" disabled={loading} className="me-2">
                                            {loading ? (<Spinner size="sm" />) : (
                                                <React.Fragment><Icon name="save" /> <span>SIMPAN</span></React.Fragment>
                                            )}
                                        </Button>
                                        {id !== undefined && (
                                            <Button color="light" type="button" onClick={() => navigate('/pendaftaran/data-sekolah-asal')}>
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
                                        <h6 className="lead-text text-primary">1. Lembaga</h6>
                                        <ul className="list list-sm list-checked small">
                                            <li>Pilih <strong>Lembaga</strong> pendidikan yang dituju (RA/MI/MTS/MA).</li>
                                        </ul>
                                    </div>

                                    <div className="mb-3">
                                        <h6 className="lead-text text-primary">2. Program Madrasah</h6>
                                        <ul className="list list-sm list-checked small">
                                            <li>Tentukan <strong>Program Pilihan</strong> yang diminati (contoh: Reguler, Tahfidz).</li>
                                            <li>Program yang tersedia bergantung pada jenjang lembaga yang dipilih.</li>
                                        </ul>
                                    </div>

                                    <div className="mb-3">
                                        <h6 className="lead-text text-primary">3. Program Boarding</h6>
                                        <ul className="list list-sm list-checked small">
                                            <li><strong>Mukim/Asrama</strong>: Siswa wajib tinggal di asrama pondok.</li>
                                            <li><strong>Non-Mukim/Fullday</strong>: Siswa pulang pergi (tidak menginap).</li>
                                        </ul>
                                    </div>

                                    <div className="alert alert-icon alert-info mt-3" role="alert">
                                        <Icon name="alert-circle" />
                                        <strong>Info</strong>. Pastikan pilihan program sudah sesuai karena akan berpengaruh pada nilai biaya masuk.
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

export default StudentProgram;