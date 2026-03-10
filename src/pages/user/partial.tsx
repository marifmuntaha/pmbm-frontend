import UserForm from "@/components/pages/user/form";
import { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalHeader, Spinner } from "reactstrap";
import { useForm } from "react-hook-form";
import { Icon } from "@/components";
import { store as storeUser, update as updateUser } from "@/common/api/user";
import { useAuthContext } from "@/common/hooks/useAuthContext";
import type { UserType } from "@/types";

interface PartialProps {
    modal: boolean;
    setModal: (modal: boolean) => void;
    user: UserType
    setUser: (user: UserType) => void;
    setLoadData: (loadData: boolean) => void;
}

const Partial = ({ modal, setModal, user, setUser, setLoadData }: PartialProps) => {
    const auth = useAuthContext();
    const methods = useForm<UserType>();
    const { handleSubmit, setValue, reset } = methods;
    const [loading, setLoading] = useState(false);

    const onSubmit = async (formData: UserType) => {
        if (user.id === undefined) await onStore(formData)
        else await onUpdate(formData);
    }
    const onStore = async (formData: UserType) => {
        setLoading(true);
        await storeUser(formData).then((resp) => {
            if (resp) {
                toggle()
                setLoadData(true)
            }
        }).finally(() => setLoading(false));
    }
    const onUpdate = async (formData: UserType) => {
        setLoading(true)
        await updateUser(formData).then(() => {
            toggle()
            setLoadData(true)
        }).finally(() => setLoading(false));
    }
    const handleReset = () => {
        setUser({
            id: undefined,
            institutionId: undefined,
            name: '',
            email: '',
            role: 0,
            phone: '',
            phone_verified_at: undefined
        });
        reset();
    }
    const toggle = () => {
        setModal(false);
        handleReset();
    };
    useEffect(() => {
        setValue('id', user.id);
        setValue('institutionId', auth.user?.role !== 1 ? auth.user?.institutionId : user.institutionId)
        setValue('name', user.name);
        setValue('email', user.email);
        setValue('phone', user.phone);
        setValue('role', auth.user?.role !== 1 ? 4 : user.role);
    }, [auth, user, setValue]);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross" />
                </button>
            }>
                {user.id === undefined ? 'TAMBAH' : 'UBAH'}
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <UserForm methods={methods} />
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
