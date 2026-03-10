import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {useForm} from "react-hook-form";
import {useState} from "react";
import {store as storeVerification} from "@/common/api/student/verivication";
import {useAuthContext} from "@/common/hooks/useAuthContext";
import type {PaymentModalType} from "@/types/model/payment";
import type {
    StudentVerificationFormType,
    StudentVerificationType
} from "@/types";
import StudentVerificationForm from "@/components/pages/student/form/verification.tsx";

type VerificationPropsType = {
    modal: PaymentModalType
    setModal: (modal: PaymentModalType) => void
}
const Verification = ({modal, setModal}: VerificationPropsType) => {
    const methods = useForm<StudentVerificationFormType>()
    const {handleSubmit} = methods;
    const {user} = useAuthContext()
    const [loading, setLoading] = useState(false)
    const onSubmit = (values: StudentVerificationFormType) => {
        setLoading(true)
        const formData: StudentVerificationType = {
            ...values,
            userId: user?.id,
            twins: values.twins.value,
            graduate: values.graduate.value,
            domicile: values.domicile.value,
            student: values.student.value,
            teacherSon: values.teacherSon.value,
            sibling: values.sibling.value,
            siblingInstitution: values.siblingInstitution?.value
        }
        storeVerification(formData).then((resp) => {
            if (resp) setModal({...modal, verification: false})
        }).finally(() => setLoading(false))
    }

    return (
        <Modal isOpen={modal.verification}>
            <ModalHeader>Verifikasi Pendaftaran</ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <StudentVerificationForm methods={methods} user={user} />
                    <div className="form-group">
                        <Button color="primary" type="submit" size="md">
                            {loading ? <Spinner size="sm"/> : 'SAMPAN'}
                        </Button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    )
}

export default Verification;