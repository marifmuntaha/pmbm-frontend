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
import StudentAddressForm from "@/components/pages/student/form/address";
import { useForm, useWatch } from "react-hook-form";
import type { StudentAddressFormType, StudentAddressType } from "@/types";
import { get as getAddress, store as storeAddress, update as updateAddress } from "@/common/api/student/address";
import { Card, CardHeader, Spinner } from "reactstrap";
import { useNavigate } from "react-router-dom";

const StudentAddress = () => {
    const year = useYearContext()
    const methods = useForm<StudentAddressFormType>();
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { control, handleSubmit, setValue } = methods;
    const [sm, updateSm] = useState(false)
    const [loading, setLoading] = useState(false);
    const id = useWatch({ control, name: 'id' })
    const onSubmit = (values: StudentAddressFormType) => {
        setLoading(true)
        const formData: StudentAddressType = {
            ...values,
            userId: user?.id,
            province: JSON.stringify(values.province),
            city: JSON.stringify(values.city),
            district: JSON.stringify(values.district),
            village: JSON.stringify(values.village),
        }
        if (formData.id === undefined) {
            storeAddress(formData).then((resp) => setValue('id', resp?.id))
                .finally(() => setLoading(false))
        } else {
            updateAddress(formData).finally(() => setLoading(false))
        }
    }

    useEffect(() => {
        getAddress({ userId: user?.id }).then((resp) => {
            if (resp.length > 0) {
                const result = resp[0]
                setValue('id', result?.id)
                setValue('province', JSON.parse(result.province))
                setValue('city', JSON.parse(result.city))
                setValue('district', JSON.parse(result.district))
                setValue('village', JSON.parse(result.village))
                setValue('street', result.street)
                setValue('rt', result.rt)
                setValue('rw', result.rw)
                setValue('postal', result.postal)
            } else return
        })
    }, [user]);

    return (
        <React.Fragment>
            <Head title="Data Tempat Tinggal" />
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Data Tempat Tinggal</BlockTitle>
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
                                    <StudentAddressForm methods={methods} />
                                    <div className="form-group between-center">
                                        <Button color="primary" type="submit" disabled={loading} className="me-2">
                                            {loading ? (<Spinner size="sm" />) : (
                                                <React.Fragment><Icon name="save" /> <span>SIMPAN</span></React.Fragment>
                                            )}
                                        </Button>
                                        {id !== undefined && (
                                            <Button color="light" type="button" onClick={() => navigate('/pendaftaran/program-pilihan')}>
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
                                        <h6 className="lead-text text-primary">1. Wilayah Administrasi</h6>
                                        <ul className="list list-sm list-checked small">
                                            <li>Pilih <strong>Provinsi, Kota/Kabupaten, Kecamatan, dan Desa/Kelurahan</strong> secara berurutan.</li>
                                            <li>Pastikan data wilayah sesuai dengan alamat tempat tinggal saat ini.</li>
                                        </ul>
                                    </div>
                                    <div className="mb-3">
                                        <h6 className="lead-text text-primary">2. Detail Alamat</h6>
                                        <ul className="list list-sm list-checked small">
                                            <li>Isi lengkap nama <strong>Jalan/Gedung/Perumahan</strong>.</li>
                                            <li>Nomor <strong>RT & RW</strong> wajib diisi (jika tidak ada, isi dengan 00).</li>
                                            <li>Pastikan <strong>Kode Pos</strong> sesuai dengan wilayah desa/kelurahan.</li>
                                        </ul>
                                    </div>
                                    <div className="alert alert-icon alert-info mt-3" role="alert">
                                        <Icon name="alert-circle" />
                                        <strong>Info</strong>. Data alamat digunakan untuk pemetaan zonasi dan surat menyurat.
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

export default StudentAddress;