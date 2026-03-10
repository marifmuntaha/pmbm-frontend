import { Row } from "reactstrap";
import { Col } from "@/components";
import ParentFatherForm from "./partials/parentFather";
import ParentMotherForm from "./partials/parentMother";
import ParentGuardForm from "./partials/parentGuard";
import type { UseFormReturn } from "react-hook-form";
import type { StudentParentFormType } from "@/types";

interface StudentParentFormProps {
    methods: UseFormReturn<StudentParentFormType>
}

const StudentParentForm = ({ methods }: StudentParentFormProps) => {
    const { register, formState: { errors } } = methods;


    return (
        <Row className="gy-0">
            <div className="form-group col-md-6">
                <label className="form-label" htmlFor="numberKk">Nomor KK</label>
                <div className="form-control-wrap">
                    <input
                        type="text"
                        id="numberKk"
                        className="form-control"
                        placeholder="Ex. 1234512345123456"
                        {...register('numberKk', {
                            required: 'Kolom tidak boleh kosong',
                            pattern: {
                                value: /^\d{16}$/,
                                message: "Nomor KK harus terdiri dari 16 digit angka"
                            }
                        })}
                    />
                    {errors.numberKk && <span className="invalid">{errors.numberKk.message}</span>}
                </div>
            </div>
            <div className="form-group col-md-6">
                <label className="form-label" htmlFor="headFamily">Kepala Keluarga</label>
                <div className="form-control-wrap">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ex. Muhammad Arif"
                        {...register('headFamily', {
                            required: 'Kolom tidak boleh kosong',
                        })}
                    />
                    {errors.headFamily && <span className="invalid">{errors.headFamily.message}</span>}
                </div>
            </div>
            <hr />
            <Col md={6}>
                <ParentFatherForm methods={methods} />
            </Col>
            <Col md={6} className="mb-3">
                <ParentMotherForm methods={methods} />
            </Col>
            <hr />
            <Col md={12}>
                <ParentGuardForm methods={methods} />
            </Col>
        </Row>
    )
}

export default StudentParentForm