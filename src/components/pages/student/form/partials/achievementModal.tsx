import React, { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalHeader, Spinner } from "reactstrap";
import { Controller, useForm } from "react-hook-form";
import { Icon, Row, RSelect } from "@/components";
import { store as storeAchievement, update as updateAchievement } from "@/common/api/student/achievement";
import type { StudentAchievementType } from "@/types";
import { CHAMP_ACHIEVEMENT_OPTIONS, LEVEL_ACHIEVEMENT_OPTIONS, TYPE_ACHIEVEMENT_OPTIONS } from "@/common/constants";
import { useAuthContext } from "@/common/hooks/useAuthContext";
import { useYearContext } from "@/common/hooks/useYearContext";

interface PartialProps {
    modal: boolean;
    setModal: (modal: boolean) => void;
    achievement: StudentAchievementType
    setAchievement: (achievement: StudentAchievementType) => void;
    setLoadData: (loadData: boolean) => void;
}

const AchievementModal = ({ modal, setModal, achievement, setAchievement, setLoadData }: PartialProps) => {
    const year = useYearContext()
    const [loading, setLoading] = useState(false);
    const { user } = useAuthContext()
    const {
        control,
        reset,
        handleSubmit,
        register,
        formState: { errors },
        setValue
    } = useForm<StudentAchievementType>();

    const onSubmit = (values: StudentAchievementType) => {
        const formData: StudentAchievementType = {
            ...values,
            yearId: year?.id,
            userId: user?.id,
            image: values.image[0]
        }
        if (achievement.id === undefined) onStore(formData)
        else onUpdate(formData);
    }
    const onStore = async (value: StudentAchievementType) => {
        setLoading(true);
        await storeAchievement(value).then((resp) => {
            if (resp) {
                toggle()
                setLoadData(true)
            }
        }).finally(() => setLoading(false));
    }
    const onUpdate = async (value: StudentAchievementType) => {
        setLoading(true)
        await updateAchievement(value).then(() => {
            toggle()
            setLoadData(true)
        }).finally(() => setLoading(false));
    }
    const handleReset = () => {
        setAchievement({
            id: undefined,
            level: undefined,
            champ: undefined,
            type: undefined,
            name: '',
            file: '',
            image: undefined,
        });
        reset();
    }
    const toggle = () => {
        setModal(false);
        handleReset();
    };
    useEffect(() => {
        setValue('id', achievement.id);
        setValue('level', achievement.level);
        setValue('champ', achievement.champ);
        setValue('type', achievement.type);
        setValue('name', achievement.name);
        setValue('file', achievement.file);
    }, [achievement, setValue]);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross" />
                </button>
            }>
                {achievement.id === undefined ? 'TAMBAH' : 'UBAH'}
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <Row className="gy-0">
                        <div className="form-group col-md-4">
                            <label className="form-label" htmlFor="level">Tingkat</label>
                            <div className="form-control-wrap">
                                <Controller
                                    control={control}
                                    name="level"
                                    rules={{ required: "Tingkat tidak boleh kosong" }}
                                    render={({ field: { value, onChange } }) => (
                                        <React.Fragment>
                                            <RSelect
                                                options={LEVEL_ACHIEVEMENT_OPTIONS}
                                                value={LEVEL_ACHIEVEMENT_OPTIONS.find((item) => item.value === value)}
                                                onChange={(val) => onChange(val?.value)}
                                                placeholder="Pilih Aktif"
                                            />
                                            <input type="hidden" id="level" className="form-control" />
                                            {errors.level && <span className="invalid">Kolom tidak boleh kosong.</span>}
                                        </React.Fragment>
                                    )
                                    } />
                            </div>
                        </div>
                        <div className="form-group col-md-4">
                            <label className="form-label" htmlFor="champ">Juara</label>
                            <div className="form-control-wrap">
                                <Controller
                                    control={control}
                                    name="champ"
                                    rules={{ required: "Tingkat tidak boleh kosong" }}
                                    render={({ field: { value, onChange } }) => (
                                        <React.Fragment>
                                            <RSelect
                                                options={CHAMP_ACHIEVEMENT_OPTIONS}
                                                value={CHAMP_ACHIEVEMENT_OPTIONS.find((item) => item.value === value)}
                                                onChange={(val) => onChange(val?.value)}
                                                placeholder="Pilih Aktif"
                                            />
                                            <input type="hidden" id="champ" className="form-control" />
                                            {errors.champ && <span className="invalid">Kolom tidak boleh kosong.</span>}
                                        </React.Fragment>
                                    )
                                    } />
                            </div>
                        </div>
                        <div className="form-group col-md-4">
                            <label className="form-label" htmlFor="type">Jenis</label>
                            <div className="form-control-wrap">
                                <Controller
                                    control={control}
                                    name="type"
                                    rules={{ required: "Tingkat tidak boleh kosong" }}
                                    render={({ field: { value, onChange } }) => (
                                        <React.Fragment>
                                            <RSelect
                                                options={TYPE_ACHIEVEMENT_OPTIONS}
                                                value={TYPE_ACHIEVEMENT_OPTIONS.find((item) => item.value === value)}
                                                onChange={(val) => onChange(val?.value)}
                                                placeholder="Pilih Aktif"
                                            />
                                            <input type="hidden" id="type" className="form-control" />
                                            {errors.type && <span className="invalid">Kolom tidak boleh kosong.</span>}
                                        </React.Fragment>
                                    )
                                    } />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="name">Nama Event</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder="Ex. Jepara Inovatioan Award Vol. 2 UNISNU Jepara"
                                    {...register("name", { required: true })}
                                />
                                {errors.name && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="image">Scan/Foto Sertifikat</label>
                            <div className="form-control-wrap">
                                <input
                                    type="file"
                                    id="image"
                                    className="form-control"
                                    {...register("image", {
                                        required: "Berkas tidak boleh kosong.",
                                        validate: {
                                            fileSize: (files) => files[0]?.size < 2000000 || "Ukuran file harus kurang dari 2 MB",
                                            fileType: (files) => ['image/jpeg', 'image/png', 'image/jpg'].includes(files[0]?.type) || "Hanya file JPEG/JPG/PNG yang diperbolehkan",
                                        }
                                    })}
                                />
                                {errors.image && <span className="invalid">{String(errors.image.message)}</span>}
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

export default AchievementModal;
