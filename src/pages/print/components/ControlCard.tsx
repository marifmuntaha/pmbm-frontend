
import React from 'react';
import moment from "moment/moment";
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

interface ControlCardProps {
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

const ControlCard = React.forwardRef<HTMLDivElement, ControlCardProps>(({ data, institution, year }, ref) => {
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
                    <h5 className="fw-bold mb-0 text-decoration-underline">KARTU DAFTAR ULANG</h5>
                    <p className="fw-bold mb-0">TAHUN AJARAN {year?.name}</p>
                    <p className="fs-14px">Nomor Pendaftaran: <span className="text-primary fw-bold text-uppercase">{data?.program?.registration_number || '-'}</span></p>
                </div>
                <table className="table table-borderless table-sm mb-0">
                    <tbody>
                        <tr>
                            <td style={{ width: '200px' }}>Nomor Registrasi</td>
                            <td style={{ width: '10px' }}>:</td>
                            <td className="fw-bold">{data?.program?.registration_number || '-'}</td>
                        </tr>
                        <tr>
                            <td>Nama Lengkap</td>
                            <td>:</td>
                            <td className="fw-bold">{data?.personal?.name}</td>
                        </tr>
                        <tr>
                            <td>Nama Wali</td>
                            <td>:</td>
                            <td>{data?.parent?.guardName}</td>
                        </tr>
                        <tr>
                            <td>Alamat</td>
                            <td>:</td>
                            <td>{data?.address?.street}</td>
                        </tr>
                        <tr>
                            <td>Program Madrasah</td>
                            <td>:</td>
                            <td>{data?.program?.program?.name}</td>
                        </tr>
                        <tr>
                            <td>Program Boarding</td>
                            <td>:</td>
                            <td>{data?.program?.boarding?.name}</td>
                        </tr>
                        <tr>
                            <td>Kamar</td>
                            <td>:</td>
                            <td>{data?.program?.room?.name}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Checklist */}
            <div className="mt-3">
                <p className="fw-bold mb-2">Kelengkapan Berkas (Diisi oleh Petugas):</p>
                <table className="table table-bordered table-sm">
                    <thead className="text-center bg-light">
                        <tr>
                            <th style={{ width: '50px' }}>No</th>
                            <th>Nama Berkas</th>
                            <th style={{ width: '80px' }}>Ada</th>
                            <th style={{ width: '80px' }}>Tidak</th>
                            <th style={{ width: '150px' }}>Keterangan</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="text-center">1</td>
                            <td>Formulir Pendaftaran (Dicetak dari sistem)</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td className="text-center">2</td>
                            <td>Bukti Pembayaran (Lunas)</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td className="text-center">3</td>
                            <td>Pas Foto Berwarna 3x4 (3 lembar)</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td className="text-center">4</td>
                            <td>Fotokopi Kartu Keluarga (KK)</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td className="text-center">5</td>
                            <td>Fotokopi Akta Kelahiran</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td className="text-center">6</td>
                            <td>Fotokopi Ijazah/SKL (Legalisir)</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td className="text-center">7</td>
                            <td>Fotokopi KIP/KKS/PKH (Jika ada)</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td className="text-center">8</td>
                            <td>Sertifikat Prestasi (Jika ada)</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Signature */}
            <div className="mt-5">
                <div className="row">
                    <div className="col-8"></div>
                    <div className="col-4 text-center">
                        <p className="mb-5">
                            {institution?.address?.split(',')[0] || 'Menganti'}, {moment().format('DD MMMM YYYY')}<br />
                            Petugas Verifikasi,
                        </p>
                        <p className="fw-bold mb-0 mt-5">( ............................................ )</p>
                    </div>
                </div>
            </div>

            <div className="mt-5 pt-5 text-center text-muted fst-italic fs-10px">
                * Kartu ini wajib dibawa saat verifikasi berkas fisik
            </div>
        </div>
    );
});

ControlCard.displayName = 'ControlCard';

export default ControlCard;
