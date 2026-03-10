import {Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import type {OptionsType, StudentBoardingType} from "@/types";
import {Button, Icon, RSelect} from "@/components";
import {useState, useEffect, type FC} from "react";
import {useForm, Controller} from "react-hook-form";
import {updateStudentProgram} from "@/common/api/student";

interface SignRoomProps {
    modal: boolean;
    setModal: (modal: boolean) => void;
    selectedStudent: StudentBoardingType | null;
    roomOptions: OptionsType[];
    handleRefresh: () => void;
}

type SignRoomForm  = {
    roomId: OptionsType | null;
}

const SignRoom: FC<SignRoomProps> = ({modal, setModal, selectedStudent, roomOptions, handleRefresh}) => {
    const [loading, setLoading] = useState(false);
    const {control, handleSubmit, reset, setValue, formState: {errors}} = useForm<SignRoomForm>();
    const onSubmit = async (data: SignRoomForm) => {
        if (!selectedStudent || !data.roomId) return;
        setLoading(true);
        try {
            await updateStudentProgram(selectedStudent.id!, {
                roomId: data.roomId.value
            });
            handleRefresh();
            setModal(false);
            reset();
        } catch (error) {
            console.error('Error assigning room:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setModal(false);
        reset();
    };

    useEffect(() => {
        if (selectedStudent && modal) {
            if (selectedStudent.room) {
                const currentRoom = roomOptions.find(opt => opt.label.includes(selectedStudent.room!));
                if (currentRoom) {
                    setValue('roomId', currentRoom);
                } else {
                    reset({roomId: null});
                }
            } else {
                reset({roomId: null});
            }
        }
    }, [selectedStudent, modal, roomOptions, setValue, reset]);

    return (
        <Modal isOpen={modal} toggle={handleClose} size="md">
            <ModalHeader toggle={handleClose}>
                Atur Kamar Santri
            </ModalHeader>
            <ModalBody>
                {selectedStudent && (
                    <div className="mb-3">
                        <div className="alert alert-info">
                            <strong>Santri:</strong> {selectedStudent.name}<br/>
                            <strong>Boarding:</strong> {selectedStudent.boarding || '-'}
                        </div>
                    </div>
                )}
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label className="form-label">Pilih Kamar</label>
                        <Controller
                            name="roomId"
                            control={control}
                            rules={{required: "Kamar harus dipilih"}}
                            render={({field}) => (
                                <RSelect
                                    {...field}
                                    options={roomOptions}
                                    placeholder="Pilih kamar..."
                                />
                            )}
                        />
                        {errors.roomId &&
                            <span className="invalid text-danger d-block mt-1">{errors.roomId.message}</span>}
                    </div>
                    <div className="form-group mt-3">
                        <Button
                            color="primary"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? <Spinner size="sm"/> : <Icon name="save"/>}
                            <span className="ms-1">SIMPAN</span>
                        </Button>
                        <Button
                            color="secondary"
                            className="ms-2"
                            onClick={handleClose}
                            type="button"
                        >
                            <Icon name="cross"/>
                            <span>BATAL</span>
                        </Button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    );
}

export default SignRoom;
