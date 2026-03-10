import React, { type FC } from "react";
import { Button, Row } from "@/components";
import { Spinner } from "reactstrap";

interface InstitutionFormProps {
    method: any
    loading: boolean
}
const InstitutionForm: FC<InstitutionFormProps> = ({ method, loading }) => {
    const { register, formState: { errors }, watch } = method
    return (
        <React.Fragment>
            <Row className="gy-1">
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="name">Nama Lengkap Lembaga</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder="Ex. Madrasah Aliyah Darul Hikmah Menganti"
                            {...register("name", { required: 'Kolom tidak boleh kosong' })}
                        />
                        {errors.name && <span className="invalid">{errors.name.message}</span>}
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="surname">Alias</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            id="surname"
                            placeholder="Ex. MA Darul Hikmah Menganti"
                            {...register("surname", { required: 'Kolom tidak boleh kosong' })}
                        />
                        {errors.surname && <span className="invalid"></span>}
                    </div>
                </div>
                <div className="form-group col-md-12">
                    <label className="form-label" htmlFor="tagline">Tagline</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            id="tagline"
                            placeholder="Ex. Hemat Cermat dan Bersahaja"
                            {...register("tagline", { required: 'Kolom tidak boleh kosong' })}
                        />
                        {errors.tagline && <span className="invalid">Kolom tidak boleh kosong</span>}
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="npsn">NPSN</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            id="npsn"
                            placeholder="Ex. 12345678"
                            {...register("npsn", { required: 'Kolom tidak boleh kosong' })}
                        />
                        {errors.npsn && <span className="invalid">Kolom tidak boleh kosong</span>}
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="nsm">NSM</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            id="nsm"
                            placeholder="Ex. 1234567890"
                            {...register("nsm", { required: 'Kolom tidak boleh kosong' })}
                        />
                        {errors.nsm && <span className="invalid">Kolom tidak boleh kosong</span>}
                    </div>
                </div>
                <div className="form-group col-md-12">
                    <label className="form-label" htmlFor="address">Alamat</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            id="address"
                            placeholder="Ex. Jl. Raya Jepara Bugel KM 07 Menganti Kedung Jepara"
                            {...register("address", { required: 'Kolom tidak boleh kosong' })}
                        />
                        {errors.address && <span className="invalid">Kolom tidak boleh kosong</span>}
                    </div>
                </div>
                <div className="form-group col-md-4">
                    <label className="form-label" htmlFor="phone">Nomor Telepon</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            id="phone"
                            placeholder="Ex. (0291) 675 6789"
                            {...register("phone", { required: 'Kolom tidak boleh kosong' })}
                        />
                        {errors.phone && <span className="invalid">Kolom tidak boleh kosong</span>}
                    </div>
                </div>
                <div className="form-group col-md-4">
                    <label className="form-label" htmlFor="email">Alamat Email</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            id="email"
                            placeholder="Ex. ma@darul-hikmah.sch.id"
                            {...register("email", { required: 'Kolom tidak boleh kosong' })}
                        />
                        {errors.email && <span className="invalid">Kolom tidak boleh kosong</span>}
                    </div>
                </div>
                <div className="form-group col-md-4">
                    <label className="form-label" htmlFor="website">Website</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            id="website"
                            placeholder="Ex. https://ma.darul-hikmah.sch.id"
                            {...register("website", { required: 'Kolom tidak boleh kosong' })}
                        />
                        {errors.website && <span className="invalid">Kolom tidak boleh kosong</span>}
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="head">Kepala Madrasah</label>
                    <div className="form-control-wrap">
                        <input
                            type="text"
                            className="form-control"
                            id="head"
                            placeholder="Ex. Faiz Noor, S.Pd."
                            {...register("head", { required: 'Kolom tidak boleh kosong' })}
                        />
                        {errors.head && <span className="invalid">Kolom tidak boleh kosong</span>}
                    </div>
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="file">Logo Madrasah</label>
                    <div className="form-control-wrap">
                        <input
                            type="file"
                            id="file"
                            className="form-control"
                            {...register("file", {
                                required: watch('id') ? false : "Berkas tidak boleh kosong.",
                                validate: {
                                    fileSize: (files: any) => {
                                        if (files?.length > 0) {
                                            return files[0]?.size < 1000000 || "Ukuran file harus kurang dari 1 MB";
                                        }
                                        return true;
                                    },
                                    fileType: (files: any) => {
                                        if (files?.length > 0) {
                                            return ['image/jpeg', 'image/png', 'image/jpg'].includes(files[0]?.type) || "Hanya file JPEG/JPG/PNG yang diperbolehkan";
                                        }
                                        return true;
                                    },
                                }
                            })}
                        />
                        {errors.file && <span className="invalid">{String(errors.file.message)}</span>}
                    </div>
                </div>
                <div className="form-group">
                    <Button color="primary" type="submit" size="md">
                        {loading ? <Spinner size="sm" /> : 'SIMPAN'}
                    </Button>
                </div>
            </Row>
        </React.Fragment>
    )
}

export default InstitutionForm