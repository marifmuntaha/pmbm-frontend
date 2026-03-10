
import React from 'react';
import moment from "moment/moment";
import { getGender } from "@/helpers";
import { GUARD_STATUS, PARENT_JOB, PARENT_STATUS, PARENT_STUDY } from "@/common/constants";
import type {
    InstitutionType,
    StudentAddressType,
    StudentFileType,
    StudentOriginType,
    StudentParentType,
    StudentPersonalType,
    StudentProgramType,
    StudentVerificationType
} from "@/types";

interface RegistrationProofProps {
    data?: {
        personal?: StudentPersonalType;
        parent?: StudentParentType;
        address?: StudentAddressType;
        program?: StudentProgramType;
        origin?: StudentOriginType;
        file?: StudentFileType;
        verification?: StudentVerificationType;
    };
    institution?: InstitutionType;
    year?: any;
}

const RegistrationProof = React.forwardRef<HTMLDivElement, RegistrationProofProps>(({ data, institution, year }, ref) => {
    return (
        <div
            ref={ref}
            className="print-container shadow-2xl bg-white p-5 rounded-2"
            style={{
                maxWidth: '850px',
                margin: '0 auto',
                border: '1px solid #dee2e6',
                borderRadius: '8px'
            }}
        >
            <style>
                {`
                    @media print {
                        @page {
                            margin-top: 50px;
                            margin-bottom: 50px;
                        }
                        .print-container {
                            padding-top: 0 !important;
                            padding-bottom: 0 !important;
                            box-shadow: none !important;
                            border: none !important;
                        }
                    }
                `}
            </style>
            {/* Document Header */}
            <div className="text-center position-relative">
                <div className="d-flex align-items-center justify-content-center mb-1">
                    <img
                        src={institution?.logo}
                        alt="logo"
                        style={{ width: "90px", position: 'absolute', left: '0' }}
                    />
                    <div className="w-100 text-end">
                        <span className="fw-bold fs-20px">PENERIMAAN MURID BARU</span><br />
                        <span className="fw-bold fs-18px">YAYASAN DARUL HIKMAH MENGANTI</span><br />
                        <span className="fw-bold fs-18px">{institution?.name.toUpperCase()}</span><br />
                    </div>
                </div>
                <hr className="mt-2 border-2 opacity-100 border-dark" />
            </div>
            <div className="document-body">
                <div className="text-center mb-4">
                    <h5 className="fw-bold mb-0 text-decoration-underline">IDENTITAS LENGKAP PENDAFTAR</h5>
                    <p className="fw-bold mb-0">TAHUN AJARAN {year?.name}</p>
                    <p className="fs-14px">Nomor Pendaftaran: <span className="text-primary fw-bold text-uppercase">{data?.program?.registration_number || '-'}</span></p>
                </div>
                <table className="table table-bordered table-sm mb-4">
                    <tbody>
                        <tr>
                            <td className="fw-bold" colSpan={3}>A. Informasi Pribadi</td>
                        </tr>
                        <tr>
                            <td style={{ width: '40px' }}></td>
                            <td>Nama Lengkap</td>
                            <td>{data?.personal?.name}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>NISN</td>
                            <td>{data?.personal?.nisn}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>NIK</td>
                            <td>{data?.personal?.nik}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Tempat, Tanggal Lahir</td>
                            <td>{data?.personal?.birthPlace}, {moment(data?.personal?.birthDate).format('DD MMMM YYYY')}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Jenis Kelamin</td>
                            <td>{getGender(data?.personal ? data?.personal.gender : null)}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Nomor Hp</td>
                            <td>{data?.personal?.phone}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Anak Ke-</td>
                            <td>{data?.personal?.birthNumber}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Jumlah Saudara</td>
                            <td>{data?.personal?.sibling}</td>
                        </tr>
                        <tr>
                        </tr>
                    </tbody>
                </table>
                <table className="table table-bordered table-sm">
                    <tbody>
                        <tr>
                            <td className="fw-bold" colSpan={4}>B. Informasi Orangtua</td>
                        </tr>
                        <tr>
                            <td style={{ width: '40px' }}></td>
                            <td>Nomor Kartu Keluarga</td>
                            <td colSpan={2}>{data?.parent?.numberKk}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Nama Kepala Keluarga</td>
                            <td colSpan={2}>{data?.parent?.headFamily}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td className="text-center fw-bold">Ayah Kandung</td>
                            <td className="text-center fw-bold">Ibu Kandung</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Status</td>
                            <td className="text-center">{PARENT_STATUS.find((item) => item.id === data?.parent?.fatherStatus)?.name}</td>
                            <td className="text-center">{PARENT_STATUS.find((item) => item.id === data?.parent?.motherStatus)?.name}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Nama</td>
                            <td className="text-center">{data?.parent?.fatherName}</td>
                            <td className="text-center">{data?.parent?.motherName}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>NIK</td>
                            <td className="text-center">{data?.parent?.fatherNik}</td>
                            <td className="text-center">{data?.parent?.motherNik}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Tempat, Tanggal Lahir</td>
                            <td className="text-center">{data?.parent?.fatherBirthPlace}, {moment(data?.parent?.fatherBirthDate).format("DD MMMM YYYY")}</td>
                            <td className="text-center">{data?.parent?.motherBirthPlace}, {moment(data?.parent?.motherBirthDate).format("DD MMMM YYYY")}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Pendidikan Terakhir</td>
                            <td className="text-center">{PARENT_STUDY.find((item) => item.id === data?.parent?.fatherStudy)?.name}</td>
                            <td className="text-center">{PARENT_STUDY.find((item) => item.id === data?.parent?.motherStudy)?.name}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Pekerjaan</td>
                            <td className="text-center">{PARENT_JOB.find((item) => item.id === data?.parent?.fatherJob)?.name}</td>
                            <td className="text-center">{PARENT_JOB.find((item) => item.id === data?.parent?.motherJob)?.name}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Nomor HP</td>
                            <td className="text-center">{data?.parent?.fatherPhone}</td>
                            <td className="text-center">{data?.parent?.motherPhone}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Status Wali</td>
                            <td colSpan={2}>{GUARD_STATUS.find((item) => item.id === data?.parent?.guardStatus)?.name}</td>
                        </tr>
                        {data?.parent?.guardStatus === 3 && (
                            <React.Fragment>
                                <tr>
                                    <td></td>
                                    <td>Nama Wali</td>
                                    <td colSpan={2}>{data.parent.guardName}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>NIK Wali</td>
                                    <td colSpan={2}>{data.parent.guardNik}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>Tempat, Tanggal Lahir Wali</td>
                                    <td colSpan={2}>{data?.parent?.guardBirthPlace}, {moment(data?.parent?.guardBirthDate).format("DD MMMM YYYY")}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>Pendidikan Terakhir Wali</td>
                                    <td colSpan={2}>{PARENT_STUDY.find((item) => item.id === data?.parent?.guardStudy)?.name}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>Pekerjaan WAli</td>
                                    <td colSpan={2}>{PARENT_JOB.find((item) => item.id === data?.parent?.guardJob)?.name}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>Nomor HP Wali</td>
                                    <td colSpan={2}>{data?.parent?.guardPhone}</td>
                                </tr>
                            </React.Fragment>
                        )}
                    </tbody>
                </table>
                <table className="table table-bordered table-sm" style={{ pageBreakInside: 'avoid' }}>
                    <tbody>
                        <tr>
                            <td className="fw-bold" colSpan={6}>C. Informasi Tempat Tinggal</td>
                        </tr>
                        <tr>
                            <td style={{ width: '40px' }}></td>
                            <td>Provinsi</td>
                            <td colSpan={2}>{data?.address?.province && JSON.parse(data.address.province).label}</td>
                            <td>Kabupaten/Kota</td>
                            <td colSpan={2}>{data?.address?.city && JSON.parse(data.address.city).label}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Kecamatan</td>
                            <td colSpan={2}>{data?.address?.district && JSON.parse(data.address.district).label}</td>
                            <td>Desa/Kelurahan</td>
                            <td colSpan={2}>{data?.address?.village && JSON.parse(data.address.village).label}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Jalan</td>
                            <td colSpan={4}>{data?.address?.street}</td>
                        </tr>
                    </tbody>
                </table>
                <table className="table table-bordered table-sm">
                    <tbody>
                        <tr>
                            <td className="fw-bold" colSpan={3}>D. Program Pilihan</td>
                        </tr>
                        <tr>
                            <td style={{ width: '40px' }}></td>
                            <td>Program</td>
                            <td colSpan={2}>{data?.program?.program?.name}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Boarding</td>
                            <td colSpan={2}>{data?.program?.boarding?.name}</td>
                        </tr>
                    </tbody>
                </table>
                <table className="table table-bordered table-sm">
                    <tbody>
                        <tr>
                            <td className="fw-bold" colSpan={3}>E. Asal Sekolah</td>
                        </tr>
                        <tr>
                            <td style={{ width: '40px' }}></td>
                            <td>Nama Sekolah</td>
                            <td colSpan={2}>{data?.origin?.name}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>NPSN</td>
                            <td colSpan={2}>{data?.origin?.npsn}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Alamat</td>
                            <td colSpan={2}>{data?.origin?.address}</td>
                        </tr>
                    </tbody>
                </table>
                <table className="table table-bordered table-sm">
                    <tbody>
                        <tr>
                            <td className="fw-bold" colSpan={3}>F. Verifikasi Data</td>
                        </tr>
                        <tr>
                            <td style={{ width: '40px' }}></td>
                            <td>Mempunyai Kembaran</td>
                            <td>{data?.verification?.twins === 1 ? 'Ya' : 'Tidak'}</td>
                        </tr>
                        {data?.verification?.twins === 1 && (
                            <tr>
                                <td></td>
                                <td>Nama Kembaran</td>
                                <td>{data?.verification?.twinsName}</td>
                            </tr>
                        )}
                        <tr>
                            <td></td>
                            <td>Alumni Sekolah Sebelumnya</td>
                            <td>{data?.verification?.graduate === 1 ? 'Ya' : 'Tidak'}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Domisili di Sekitar Sekolah</td>
                            <td>{data?.verification?.domicile === 1 ? 'Ya' : 'Tidak'}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Santri Ponpes</td>
                            <td>{data?.verification?.student === 1 ? 'Ya' : 'Tidak'}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Anak Guru/Karyawan</td>
                            <td>{data?.verification?.teacherSon === 1 ? 'Ya' : 'Tidak'}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Mempunyai Saudara</td>
                            <td>{data?.verification?.sibling === 1 ? 'Ya' : 'Tidak'}</td>
                        </tr>
                        {data?.verification?.sibling === 1 && (
                            <React.Fragment>
                                <tr>
                                    <td></td>
                                    <td>Nama Saudara</td>
                                    <td>{data?.verification?.siblingName}</td>
                                </tr>
                            </React.Fragment>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
});

RegistrationProof.displayName = 'RegistrationProof';

export default RegistrationProof;
