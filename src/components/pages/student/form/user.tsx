import React, {useEffect, useState} from "react";
import UserForm from "@/components/pages/user/form";
import {useForm} from "react-hook-form";
import type {UserType} from "@/types";
import {store as storeUser, update as updateUser} from "@/common/api/user";
import {useAuthContext} from "@/common/hooks/useAuthContext";
import {Button} from "@/components";
import {Spinner} from "reactstrap";

interface StudentUserFormProps {
    user?: UserType;
    setUser: (user?: UserType) => void;
}
const StudentUserForm = ({user, setUser} : StudentUserFormProps) => {
    const auth = useAuthContext();
    const methods = useForm<UserType>();
    const {handleSubmit, setValue} = methods;
    const [loading, setLoading] = useState(false)
    const onSubmit = (formData: UserType) => {
        if (formData.id === undefined) onStore(formData)
        else onUpdate(formData);
    }
    const onStore = async (formData: UserType) => {
        setLoading(true);
        await storeUser(formData).then((resp) => setUser(resp)).finally(() => setLoading(false));
    }
    const onUpdate = async (formData: UserType) => {
        setLoading(true)
        await updateUser(formData).finally(() => setLoading(false));
    }

    useEffect(() => {
        setValue('id', user ? user.id : undefined)
        setValue('institutionId', auth.user?.role === 2 ? auth.user.institutionId : undefined)
        setValue('name', user ? user.name : '')
        setValue('email', user ? user.email : '')
        setValue('phone', user ? user.phone : '')
        setValue('role', 4)
    }, [auth, user]);

    return (
        <React.Fragment>
            <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                <UserForm methods={methods} />
                <div className="form-group">
                    <Button color="primary" type="submit" size="md">
                        {loading ? <Spinner size="sm"/> : 'SIMPAN'}
                    </Button>
                </div>
            </form>
        </React.Fragment>
    )
}

export default StudentUserForm