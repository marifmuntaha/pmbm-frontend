import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {Icon, RSelect} from "@/components";
import {useForm} from "react-hook-form";
import {get as getStudents} from "@/common/api/student/personal";
import type {OptionsType, PaymentType} from "@/types";
import {useEffect, useState} from "react";

interface PartialProps {
    modal: boolean;
    setModal: (modal: boolean) => void;
}
const Partial = ({modal, setModal} : PartialProps) => {
    const {handleSubmit} = useForm<PaymentType>();
    const [loading, setLoading] = useState(false);
    const [studentOptions, setStudentOptions] = useState<OptionsType[]>([])
    const [studentSelected, setStudentSelected] = useState<OptionsType>()
    const onSubmit = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 3000)
    }
    const toggle = () => {
        setModal(!modal);
    }

    useEffect(() => {
        const fetchData = async () => {
            if (modal) {
                const students = await getStudents<OptionsType>({type: 'select', data: 'transaction'});
                setStudentOptions(students)
            }
        }
        fetchData();
    }, [modal])

    return (
        <Modal isOpen={modal} toggle={toggle} size="lg">
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross" />
                </button>
            }>
                TAMBAH TRANSAKSI
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <div className="label">Pilih Siswa</div>
                        <div className="form-control-wrap">
                            <RSelect
                                options={studentOptions}
                                value={studentOptions?.find((item) => item.value === studentSelected?.value)}
                                onChange={(val) => {
                                    setStudentSelected(val ?? undefined)
                                }}
                                placeholder="Pilih Siswa"
                            />
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <tbody>
                            <tr>
                                <td>Nomor Pendaftaran</td>
                                <td>{studentSelected?.data.student.number}</td>
                            </tr>
                            <tr>
                                <td>Jenjang</td>
                                <td>{studentSelected?.data.program.institution}</td>
                            </tr>
                            <tr>
                                <td>Nama Siswa</td>
                                <td>{studentSelected?.data.student.name}</td>
                            </tr>
                            <tr>
                                <td>Nama Wali</td>
                                <td>{studentSelected?.data.parent.guardName}</td>
                            </tr>
                            <tr>
                                <td>Alamat</td>
                                <td>{studentSelected?.data.address.street}</td>
                            </tr>
                            <tr>
                                <td>Program Pilihan</td>
                                <td>{studentSelected?.data.program.name}</td>
                            </tr>
                            </tbody>
                        </table>
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