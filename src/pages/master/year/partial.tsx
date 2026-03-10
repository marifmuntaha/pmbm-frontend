import React, { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalHeader, Spinner } from "reactstrap";
import { Controller, useForm } from "react-hook-form";
import { Icon, RSelect } from "@/components";
import { store as storeYear, update as updateYear } from "@/common/api/master/year";
import type { OptionsType, YearFormType, YearType } from "@/types";

interface PartialProps {
    modal: boolean;
    setModal: (modal: boolean) => void;
    year: YearType
    setYear: (year: YearType) => void;
    setLoadData: (loadData: boolean) => void;
}

const Partial = ({ modal, setModal, year, setYear, setLoadData }: PartialProps) => {
    const [loading, setLoading] = useState(false);
    const activeOptions: OptionsType[] = [
        { value: 1, label: "Ya" },
        { value: 2, label: "Tidak" },
    ]
    const {
        control,
        reset,
        handleSubmit,
        register,
        formState: { errors },
        setValue
    } = useForm<YearFormType>();

    const onSubmit = async (value: YearFormType) => {
        const formData: YearType = {
            id: value.id,
            name: value.name,
            description: value.description,
            active: value.active?.value
        }
        if (year.id === undefined) await onStore(formData)
        else await onUpdate(formData);
    }
    const onStore = async (value: YearType) => {
        setLoading(true);
        await storeYear(value).then(() => {
            toggle()
            setLoadData(true)
        }).finally(() => setLoading(false));
    }
    const onUpdate = async (value: YearType) => {
        setLoading(true)
        await updateYear(value).then(() => {
            toggle()
            setLoadData(true)
        }).finally(() => setLoading(false));
    }
    const handleReset = () => {
        setYear({
            id: undefined,
            name: '',
            description: '',
            active: undefined
        });
        reset();
    }
    const toggle = () => {
        setModal(false);
        handleReset();
    };
    useEffect(() => {
        setValue('id', year.id);
        setValue('name', year.name);
        setValue('description', year.description);
        setValue('active', activeOptions.find((item) => item.value === year.active));
    }, [year, setValue]);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross" />
                </button>
            }>
                {year.id === undefined ? 'TAMBAH' : 'UBAH'}
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">Nama Tahun</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Ex. 2024/2025"
                                {...register("name", { required: true })}
                            />
                            {errors.name && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="description">Diskripsi</label>
                        <div className="form-control-wrap">
                            <textarea
                                className="form-control"
                                id="description"
                                placeholder="Ex. Tahun Pelajaran 2024/2025"
                                {...register("description", { required: false })}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="active">Pilih Aktif</label>
                        <div className="form-control-wrap">
                            <Controller
                                control={control}
                                name="active"
                                rules={{ required: "Status tahun tidak boleh kosong" }}
                                render={({ field }) => (
                                    <React.Fragment>
                                        <RSelect
                                            options={activeOptions}
                                            value={field.value}
                                            onChange={(selectedOption) => field.onChange(selectedOption)}
                                            placeholder="Pilih Aktif"
                                        />
                                        <input type="hidden" id="active" className="form-control" />
                                        {errors.active && <span className="invalid">Kolom tidak boleh kosong.</span>}
                                    </React.Fragment>
                                )
                                } />
                        </div>
                    </div>
                    <div className="form-group">
                        <Button color="primary" type="submit" size="md">
                            {loading ? <Spinner size="sm" /> : 'SIMPAN'}
                        </Button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    )
}

export default Partial;
