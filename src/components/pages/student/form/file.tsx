import { Row } from "@/components";
import { type UseFormReturn } from "react-hook-form";
import type { StudentFileFormType, StudentFileType } from "@/types";

interface StudentFileFormProps {
    methods: UseFormReturn<StudentFileFormType>
    file?: StudentFileType
}
const StudentFileForm = ({ methods, file }: StudentFileFormProps) => {
    const { register, formState: { errors } } = methods
    const validateImage = (images: FileList | null): true | string => {
        if (!images || images.length === 0) return true;
        const file = images[0];
        const validFormats = ["image/jpeg", "image/png", "image/jpg"];
        if (!validFormats.includes(file.type)) return "Hanya gambar JPG, JPEG, atau PNG yang diperbolehkan";

        const maxSize = 1024 * 1024;
        if (file.size > maxSize) return "Gambar terlalu besar, ukuran maksimal 1MB";
        return true;
    };

    return (
        <Row className="gy-0">
            <div className="form-group col-md-4">
                <label className="form-label" htmlFor="imagePhoto">SwaPhoto/Pas Foto</label>
                <div className="form-control-wrap">
                    <input
                        type="file"
                        id="imagePhoto"
                        className="form-control"
                        {...register("imagePhoto", {
                            validate: validateImage
                        })}
                    />
                    {errors.imagePhoto && <span className="invalid">{String(errors.imagePhoto.message)}</span>}
                </div>
                {file?.filePhoto && (
                    <div className="form-note">
                        Berkas sudah diunggah, silahkan lihat <a target="_blank" href={file.filePhoto}>disini</a>
                    </div>
                )}
            </div>
            <div className="form-group col-md-4">
                <label className="form-label" htmlFor="imageKk">Foto/Scan Kartu Keluarga</label>
                <div className="form-control-wrap">
                    <input
                        type="file"
                        id="imageKk"
                        className="form-control"
                        {...register("imageKk", {
                            required: !file?.fileKk && "Berkas tidak boleh kosong.",
                            validate: validateImage
                        })}
                    />
                    {errors.imageKk && <span className="invalid">{String(errors.imageKk.message)}</span>}
                </div>
                {file?.fileKk && (
                    <div className="form-note">
                        Berkas sudah diunggah, silahkan lihat <a target="_blank" href={file.fileKk}>disini</a>
                    </div>
                )}
            </div>
            <div className="form-group col-md-4">
                <label className="form-label" htmlFor="imageKtp">Foto/Scan KTP Wali</label>
                <div className="form-control-wrap">
                    <input
                        type="file"
                        id="imageKtp"
                        className="form-control"
                        {...register("imageKtp", {
                            validate: validateImage
                        })}
                    />
                    {errors.imageKtp &&
                        <span className="invalid">{String(errors.imageKtp.message)}</span>}
                </div>
                {file?.fileKtp && (
                    <div className="form-note">
                        Berkas sudah diunggah, silahkan lihat <a target="_blank" href={file.fileKtp}>disini</a>
                    </div>
                )}
            </div>
            <div className="form-group col-md-6">
                <label className="form-label" htmlFor="numberAkta">Nomor Akta Kelahiran</label>
                <div className="form-control-wrap">
                    <input
                        type="text"
                        id="numberAkta"
                        className="form-control"
                        placeholder="Ex. 1234/ABC/2025/02/01"
                        {...register('numberAkta', { required: false })}
                    />
                    {errors.numberAkta &&
                        <span className="invalid">{errors.numberAkta.message}</span>}
                </div>
            </div>
            <div className="form-group col-md-6">
                <label className="form-label" htmlFor="imageAkta">Foto/Scan Akta Kelahiran</label>
                <div className="form-control-wrap">
                    <input
                        type="file"
                        id="imageAkta"
                        className="form-control"
                        {...register("imageAkta", {
                            validate: validateImage
                        })}
                    />
                    {errors.imageAkta &&
                        <span className="invalid">{String(errors.imageAkta.message)}</span>}
                </div>
                {file?.fileAkta && (
                    <div className="form-note">
                        Berkas sudah diunggah, silahkan lihat <a target="_blank" href={file.fileAkta}>disini</a>
                    </div>
                )}
            </div>
            <div className="form-group col-md-6">
                <label className="form-label" htmlFor="numberIjazah">Nomor Ijazah</label>
                <div className="form-control-wrap">
                    <input
                        type="text"
                        id="numberIjazah"
                        className="form-control"
                        placeholder="Ex. 1234/5678/09.1/2025"
                        {...register('numberIjazah', { required: false })}
                    />
                </div>
            </div>
            <div className="form-group col-md-6">
                <label className="form-label" htmlFor="imageIjazah">Foto/Scan Ijazah</label>
                <div className="form-control-wrap">
                    <input
                        type="file"
                        id="imageIjazah"
                        className="form-control"
                        {...register("imageIjazah", { validate: validateImage })}
                    />
                    {errors.imageIjazah &&
                        <span className="invalid">{String(errors.imageIjazah.message)}</span>}
                </div>
                {file?.fileIjazah && (
                    <div className="form-note">
                        Berkas sudah diunggah, silahkan lihat <a target="_blank" href={file.fileIjazah}>disini</a>
                    </div>
                )}
            </div>
            <div className="form-group col-md-6">
                <label className="form-label" htmlFor="numberSkl">Nomor Skl</label>
                <div className="form-control-wrap">
                    <input
                        type="text"
                        id="numberSkl"
                        className="form-control"
                        placeholder="Ex. 001/01.1/MTs.SH/IV/2026"
                        {...register('numberSkl', { required: false })}
                    />
                </div>
            </div>
            <div className="form-group col-md-6">
                <label className="form-label" htmlFor="imageSkl">Foto/Scan Skl</label>
                <div className="form-control-wrap">
                    <input
                        type="file"
                        id="imageSkl"
                        className="form-control"
                        {...register("imageSkl", { validate: validateImage })}
                    />
                    {errors.imageSkl &&
                        <span className="invalid">{String(errors.imageSkl.message)}</span>}
                </div>
                {file?.fileSkl && (
                    <div className="form-note">
                        Berkas sudah diunggah, silahkan lihat <a target="_blank" href={file.fileSkl}>di sini</a>
                    </div>
                )}
            </div>
            <div className="form-group col-md-6">
                <label className="form-label" htmlFor="numberKip">Nomor Kip</label>
                <div className="form-control-wrap">
                    <input
                        type="text"
                        id="numberKip"
                        className="form-control"
                        placeholder="Ex. 1234567891011121"
                        {...register('numberKip', { required: false })}
                    />
                </div>
            </div>
            <div className="form-group col-md-6">
                <label className="form-label" htmlFor="imageKip">Foto/Scan Kip</label>
                <div className="form-control-wrap">
                    <input
                        type="file"
                        id="imageKip"
                        className="form-control"
                        {...register("imageKip", { validate: validateImage })}
                    />
                    {errors.imageKip && <span className="invalid">{String(errors.imageKip.message)}</span>}
                </div>
                {file?.fileKip && (
                    <div className="form-note">
                        Berkas sudah diunggah, silahkan lihat <a target="_blank" href={file.fileKip}>disini</a>
                    </div>
                )}
            </div>
        </Row>
    )
}

export default StudentFileForm;