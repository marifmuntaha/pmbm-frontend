import { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalHeader, Spinner } from "reactstrap";
import { useForm } from "react-hook-form";
import { Icon } from "@/components";
import { store as storeRoom, update as updateRoom } from "@/common/api/master/room";
import type { RoomFormType, RoomType } from "@/types";

interface PartialProps {
    modal: boolean;
    setModal: (modal: boolean) => void;
    room: RoomType;
    setRoom: (room: RoomType) => void;
    setLoadData: (loadData: boolean) => void;
}

const Partial = ({ modal, setModal, room, setRoom, setLoadData }: PartialProps) => {
    const [loading, setLoading] = useState(false);
    const {
        reset,
        handleSubmit,
        register,
        formState: { errors },
        setValue,
    } = useForm<RoomFormType>();

    const onSubmit = async (value: RoomFormType) => {
        const formData: RoomType = {
            id: value.id,
            name: value.name,
            capacity: Number(value.capacity),
        };
        if (room.id === undefined) await onStore(formData);
        else await onUpdate(formData);
    };

    const onStore = async (value: RoomType) => {
        setLoading(true);
        await storeRoom(value)
            .then(() => {
                toggle();
                setLoadData(true);
            })
            .finally(() => setLoading(false));
    };

    const onUpdate = async (value: RoomType) => {
        setLoading(true);
        await updateRoom(value)
            .then(() => {
                toggle();
                setLoadData(true);
            })
            .finally(() => setLoading(false));
    };

    const handleReset = () => {
        setRoom({
            id: undefined,
            name: '',
            capacity: undefined,
        });
        reset();
    };

    const toggle = () => {
        setModal(false);
        handleReset();
    };

    useEffect(() => {
        setValue('id', room.id);
        setValue('name', room.name);
        setValue('capacity', room.capacity);
    }, [room, setValue]);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader
                toggle={toggle}
                close={
                    <button className="close" onClick={toggle}>
                        <Icon name="cross" />
                    </button>
                }
            >
                {room.id === undefined ? 'TAMBAH' : 'UBAH'} KAMAR
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">
                            Nama Kamar
                        </label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Ex. Kamar A1, Kamar Melati, dll"
                                {...register("name", { required: true })}
                            />
                            {errors.name && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="capacity">
                            Kapasitas
                        </label>
                        <div className="form-control-wrap">
                            <input
                                type="number"
                                className="form-control"
                                id="capacity"
                                placeholder="Ex. 10"
                                min="1"
                                {...register("capacity", {
                                    required: "Kapasitas tidak boleh kosong",
                                    min: { value: 1, message: "Kapasitas minimal 1" },
                                })}
                            />
                            {errors.capacity && <span className="invalid">{errors.capacity.message}</span>}
                        </div>
                        <div className="form-note">Jumlah maksimal santri yang dapat ditampung di kamar ini</div>
                    </div>
                    <div className="form-group">
                        <Button color="primary" type="submit" size="md">
                            {loading ? <Spinner size="sm" /> : 'SIMPAN'}
                        </Button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    );
};

export default Partial;
