import React, { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalHeader, Spinner } from "reactstrap";
import { Controller, useForm } from "react-hook-form";
import { Icon, RSelect } from "@/components";
import { store as storeWhatsapp, update as updateWhatsapp } from "@/common/api/whatsapp";
import { get as getInstitutions } from "@/common/api/institution";
import type { OptionsType, WhatsappType } from "@/types";
import {useAuthContext} from "@/common/hooks/useAuthContext";

interface PartialProps {
    modal: { partial: false, login: false };
    setModal: (modal: { partial: false, login: false }) => void;
    whatsapp: WhatsappType;
    setWhatsapp: (whatsapp: WhatsappType) => void;
    setLoadData: (loadData: boolean) => void;
}

const Partial = ({ modal, setModal, whatsapp, setWhatsapp, setLoadData }: PartialProps) => {
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [institutionOptions, setInstitutionOptions] = useState<OptionsType[]>([])
    const activeOptions: OptionsType[] = [
        { value: 1, label: "Ya" },
        { value: 0, label: "Tidak" },
    ]
    const {
        control,
        reset,
        handleSubmit,
        register,
        formState: { errors },
        setValue
    } = useForm<WhatsappType>();

    const onSubmit = async (values: WhatsappType) => {
        if (whatsapp.id === undefined) await onStore(values)
        else await onUpdate(values);
    }
    const onStore = async (value: WhatsappType) => {
        setLoading(true);
        await storeWhatsapp(value).then((resp) => {
            if (resp.status === "success") {
                toggle()
                setLoadData(true)
            }
        }).finally(() => setLoading(false));
    }
    const onUpdate = async (value: WhatsappType) => {
        setLoading(true)
        await updateWhatsapp(value).then(() => {
            toggle()
            setLoadData(true)
        }).finally(() => setLoading(false));
    }
    const handleReset = () => {
        setWhatsapp({
            id: undefined,
            institutionId: undefined,
            device: '',
            active: 0,
            status: 1
        });
        reset();
    }
    const toggle = () => {
        setModal({
            partial: false,
            login: false
        });
        handleReset();
    };

    useEffect(() => {
        setValue('id', whatsapp.id);
        setValue('institutionId', whatsapp.id !== undefined ? whatsapp.institutionId : user?.institutionId);
        setValue('device', whatsapp.device);
        setValue('active', whatsapp.active);
        setValue('status', whatsapp.status);
    }, [whatsapp, user, setValue]);

    useEffect(() => {
        const fetch = async () => {
            const institutions = await getInstitutions<OptionsType>({type: 'select', with: 'ladder', ladder: 'alias'})
            setInstitutionOptions(institutions)
        }
        fetch()
    }, []);

    return (
        <Modal isOpen={modal.partial} toggle={toggle}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross" />
                </button>
            }>
                {whatsapp.id === undefined ? 'TAMBAH' : 'UBAH'}
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="institutionId">Pilih Lembaga</label>
                        <div className="form-control-wrap">
                            <Controller
                                control={control}
                                name="institutionId"
                                rules={{ required: user?.role === 1 ? false : "ID Lembaga tidak boleh kosong" }}
                                render={({ field: {value, onChange} }) => (
                                    <React.Fragment>
                                        <RSelect
                                            options={institutionOptions}
                                            value={institutionOptions?.find((option) => option.value === value)}
                                            onChange={(val) => onChange(val?.value)}
                                            placeholder="Pilih Lembaga"
                                            isDisabled={user?.role !== 1}
                                        />
                                        <input type="hidden" id="institution" className="form-control" />
                                        {errors.institutionId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                                    </React.Fragment>
                                )
                                } />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="device">Nama Perangkat</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Ex. whatsapp-ma-1"
                                {...register("device", { required: true })}
                            />
                            {errors.device && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="active">Pilih Aktif</label>
                        <div className="form-control-wrap">
                            <Controller
                                control={control}
                                name="active"
                                rules={{ required: "Status Aktif tidak boleh kosong" }}
                                render={({ field: {value, onChange} }) => (
                                    <React.Fragment>
                                        <RSelect
                                            options={activeOptions}
                                            value={activeOptions.find((option) => option.value === value)}
                                            onChange={(val) => onChange(val?.value)}
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
