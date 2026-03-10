import { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalHeader, Spinner } from "reactstrap";
import { useForm } from "react-hook-form";
import { Icon, Row } from "@/components";
import { store as storeInstitution, update as updateInstitution } from "@/common/api/institution";
import type { InstitutionFormType, InstitutionType } from "@/types";

interface PartialProps {
    modal: boolean;
    setModal: (modal: boolean) => void;
    institution: InstitutionType
    setInstitution: (institution: InstitutionType) => void;
    setLoadData: (loadData: boolean) => void;
}

const Partial = ({ modal, setModal, institution, setInstitution, setLoadData }: PartialProps) => {
    const [loading, setLoading] = useState(false);
    const {
        reset,
        handleSubmit,
        register,
        formState: { errors },
        setValue,
        watch
    } = useForm<InstitutionFormType>();

    const onSubmit = (value: InstitutionFormType) => {
        const formData: InstitutionType = {
            id: value.id,
            name: value.name,
            surname: value.surname,
            tagline: value.tagline,
            npsn: value.npsn,
            nsm: value.nsm,
            address: value.address,
            phone: value.phone,
            email: value.email,
            website: value.website,
            head: value.head,
            image: value.file[0],
        }
        if (institution.id === undefined) onStore(formData)
        else onUpdate(formData);
    }
    const onStore = async (formData: InstitutionType) => {
        setLoading(true);
        await storeInstitution(formData).then((resp) => {
            if (resp.status === 'success') {
                toggle()
                setLoadData(true)
            }
        }).finally(() => setLoading(false));
    }
    const onUpdate = async (formData: InstitutionType) => {
        setLoading(true)
        await updateInstitution(formData).then((resp) => {
            if (resp.status === 'success') {
                toggle()
                setLoadData(true)
            }
        }).finally(() => setLoading(false));
    }
    const handleReset = () => {
        setInstitution({
            id: undefined,
            name: '',
            surname: '',
            tagline: '',
            npsn: '',
            nsm: '',
            address: '',
            phone: '',
            email: '',
            website: '',
            head: '',
            logo: '',
        });
        reset();
    }
    const toggle = () => {
        setModal(false);
        handleReset();
    };
    useEffect(() => {
        setValue('id', institution.id);
        setValue('name', institution.name)
        setValue('surname', institution.surname)
        setValue('tagline', institution.tagline)
        setValue('npsn', institution.npsn)
        setValue('nsm', institution.nsm)
        setValue('address', institution.address)
        setValue('phone', institution.phone)
        setValue('email', institution.email)
        setValue('website', institution.website)
        setValue('head', institution.head)
    }, [institution, setValue]);

    return (
        <Modal isOpen={modal} toggle={toggle} size="lg">
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross" />
                </button>
            }>
                {institution.id === undefined ? 'TAMBAH' : 'UBAH'}
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <Row className="gy-1">
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="name">Nama Tahun</label>
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
                </form>
            </ModalBody>
        </Modal>
    )
}

export default Partial;
