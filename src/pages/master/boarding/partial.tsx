import {useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {useForm} from "react-hook-form";
import {Icon} from "@/components";
import {store as storeBoarding, update as updateBoarding} from "@/common/api/master/boarding";
import type {BoardingFormType, BoardingType} from "@/types";

interface PartialProps {
    modal: boolean;
    setModal: (modal: boolean) => void;
    boarding: BoardingType
    setBoarding: (boarding: BoardingType) => void;
    setLoadData: (loadData: boolean) => void;
}

const Partial = ({modal, setModal, boarding, setBoarding, setLoadData}: PartialProps) => {
    const [loading, setLoading] = useState(false);
    const {
        reset,
        handleSubmit,
        register,
        formState: {errors},
        setValue
    } = useForm<BoardingFormType>();

    const onSubmit = (value: BoardingFormType) => {
        const formData: BoardingType = {
            id: value.id,
            name: value.name,
            surname: value.surname,
            description: value.description,
        }
        if (boarding.id === undefined) onStore(formData)
        else onUpdate(formData);
    }
    const onStore = async (formData: BoardingType) => {
        setLoading(true);
        await storeBoarding(formData).then(() => {
            toggle()
            setLoadData(true)
        }).finally(() => setLoading(false));
    }
    const onUpdate = async (formData: BoardingType) => {
        setLoading(true)
        await updateBoarding(formData).then(() => {
            toggle()
            setLoadData(true)
        }).finally(() => setLoading(false));
    }
    const handleReset = () => {
        setBoarding({
            id: undefined,
            name: '',
            surname: '',
            description: '',
        });
        reset();
    }
    const toggle = () => {
        setModal(false);
        handleReset();
    };
    useEffect(() => {
        setValue('id', boarding.id);
        setValue('name', boarding.name);
        setValue('surname', boarding.surname);
        setValue('description', boarding.description);
    }, [boarding, setValue]);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross"/>
                </button>
            }>
                {boarding.id === undefined ? 'TAMBAH' : 'UBAH'}
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">Nama</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Ex. Tahfidz"
                                {...register("name", {required: true})}
                            />
                            {errors.name && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="surname">Singkatan</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                className="form-control"
                                id="surname"
                                placeholder="Ex. TFZ"
                                {...register("surname", {required: true})}
                            />
                            {errors.surname && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="description">Diskripsi</label>
                        <div className="form-control-wrap">
                            <textarea
                                className="form-control"
                                id="description"
                                placeholder="Ex. Program Boarding Tahfidz"
                                {...register("description", {required: false})}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Button color="primary" type="submit" size="md">
                            {loading ? <Spinner size="sm"/> : 'SIMPAN'}
                        </Button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    )
}

export default Partial;
