import { Row } from "reactstrap";
import type { UseFormReturn } from "react-hook-form";
import type { StudentOriginType } from "@/types";

interface StudentOriginFormProps {
    methods: UseFormReturn<StudentOriginType>
}

const StudentOriginForm = ({ methods }: StudentOriginFormProps) => {
    const { register, formState: { errors } } = methods
    return (
        <Row className="gy-0 mb-3">
            <div className="form-group col-md-6">
                <label className="form-label" htmlFor="name">Nama Sekolah/Madrasah Asal</label>
                <div className="form-control-wrap">
                    <input
                        type="text"
                        id="name"
                        className="form-control"
                        placeholder="Ex. MI Darul Hikmah Menganti"
                        {...register('name', { required: 'Kolom tidak boleh kosong' })}
                    />
                    {errors.name && <span className="invalid">{errors.name.message}</span>}
                </div>
            </div>
            <div className="form-group col-md-6">
                <label className="form-label" htmlFor="npsn">NPSN</label>
                <div className="form-control-wrap">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ex. 1234567890, Kosongkan Jika tidak tahu"
                        {...register('npsn', {
                            required: false,
                            pattern: {
                                value: /^\d{0,8}$/,
                                message: "NPSN tidak valid"
                            }
                        })}
                    />
                    {errors.npsn && <span className="invalid">{errors.npsn.message}</span>}
                </div>
            </div>
            <div className="form-group col-md-12">
                <label className="form-label" htmlFor="address">Alamat Sekolah/Madrasah Asal</label>
                <div className="form-control-wrap">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ex. Jl. Raya Jepara-Bugel KM 07 Menganti"
                        {...register('address', {
                            required: 'Kolom tidak boleh kosong',
                        })}
                    />
                    {errors.address && <span className="invalid">{errors.address.message}</span>}
                </div>
            </div>
        </Row>
    )
}

export default StudentOriginForm;