import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { studentBoarding } from '@/common/api/student';
import { get as getInstitution } from '@/common/api/institution';
import { get as getBoarding } from '@/common/api/master/boarding';
import type { StudentBoardingType, OptionsType } from '@/types';
import moment from 'moment';
import Head from '@/layout/head';

const StudentBoardingPrint = () => {
    const [searchParams] = useSearchParams();
    const [students, setStudents] = useState<StudentBoardingType[]>([]);
    const [loading, setLoading] = useState(true);
    const [institutionName, setInstitutionName] = useState('Semua Lembaga');
    const [boardingName, setBoardingName] = useState('Semua Program');

    const yearId = searchParams.get('yearId');
    const institutionId = searchParams.get('institutionId');
    const boardingId = searchParams.get('boardingId');
    const gender = searchParams.get('gender');
    const yearName = searchParams.get('yearName');

    useEffect(() => {
        const fetchData = async () => {
            if (!yearId) return;

            setLoading(true);
            try {
                // Fetch filter names for header
                if (institutionId) {
                    const instResp = await getInstitution<OptionsType>({ type: 'select' });
                    const inst = instResp.find(i => i.value === Number(institutionId));
                    if (inst) setInstitutionName(inst.label);
                }

                if (boardingId) {
                    const boardResp = await getBoarding<OptionsType>({ type: 'select' });
                    const board = boardResp.find(b => b.value === Number(boardingId));
                    if (board) setBoardingName(board.label);
                }

                // Fetch students
                const params: any = {
                    yearId,
                    verified: 1,
                    paid: 1,
                    boarding: true,
                };

                if (institutionId) params.institutionId = institutionId;
                if (boardingId) params.boardingId = boardingId;
                if (gender) params.gender = gender;

                const resp = await studentBoarding(params);
                setStudents(resp);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [yearId, institutionId, boardingId, gender]);

    useEffect(() => {
        if (!loading && students.length > 0) {
            setTimeout(() => {
                window.print();
            }, 500);
        }
    }, [loading, students]);

    const getGenderLabel = (val: string | null) => {
        if (val === '1') return 'Laki-laki';
        if (val === '2') return 'Perempuan';
        return 'Semua Gender';
    };

    return (
        <React.Fragment>
            <Head title="Cetak Data Santri Boarding" />
            <div className="p-4 bg-white" style={{ minHeight: '100vh' }}>
                <div className="text-center mb-4">
                    <h3 className="mb-1">Laporan Data Santri Boarding</h3>
                    <h5 className="text-muted mb-3">Tahun Ajaran {yearName}</h5>

                    <div className="d-flex justify-content-center gap-4 text-sm">
                        <div>
                            <strong>Lembaga:</strong> {institutionName}
                        </div>
                        <div>
                            <strong>Program:</strong> {boardingName}
                        </div>
                        <div>
                            <strong>Gender:</strong> {getGenderLabel(gender)}
                        </div>
                        <div>
                            <strong>Total:</strong> {students.length} Santri
                        </div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: '50px' }} className="text-center">No</th>
                                <th>No. Pendaftaran</th>
                                <th>Nama Lengkap</th>
                                <th>Lembaga</th>
                                <th>TTL</th>
                                <th className="text-center">L/P</th>
                                <th>Wali</th>
                                <th>Alamat</th>
                                <th>Program</th>
                                <th>Kamar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={10} className="text-center py-4">Memuat data...</td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="text-center py-4">Tidak ada data ditemukan</td>
                                </tr>
                            ) : (
                                students.map((student, index) => (
                                    <tr key={index}>
                                        <td className="text-center">{index + 1}</td>
                                        <td>{student.registration_number || '-'}</td>
                                        <td>{student.name}</td>
                                        <td>{student.institution}</td>
                                        <td>
                                            {student.birthPlace}, {moment(student.birthDate).format('DD/MM/YYYY')}
                                        </td>
                                        <td className="text-center">
                                            {student.gender === 1 ? 'L' : 'P'}
                                        </td>
                                        <td>{student.guardName || '-'}</td>
                                        <td>{student.address || '-'}</td>
                                        <td>{student.boarding || '-'}</td>
                                        <td>{student.room || 'Belum diatur'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 text-end text-muted small">
                    Dicetak pada: {moment().format('DD/MM/YYYY HH:mm')}
                </div>
            </div>
            <style>
                {`
                    @media print {
                        @page {
                            size: landscape;
                            margin: 10mm;
                        }
                        body {
                            background: white !important;
                            -webkit-print-color-adjust: exact;
                            overflow: visible !important;
                        }
                        .table-responsive {
                            overflow: visible !important;
                        }
                        .table {
                            width: 100% !important;
                            border-collapse: collapse !important;
                        }
                        .table th, .table td {
                            padding: 8px 4px !important;
                            font-size: 12px !important;
                            white-space: normal !important;
                        }
                        .table th {
                            background-color: #f8f9fa !important;
                            color: #000 !important;
                            border: 1px solid #dee2e6 !important;
                        }
                        .table td {
                            border: 1px solid #dee2e6 !important;
                        }
                        /* Hide any container borders/shadows */
                        .bg-white, .p-4 {
                            box-shadow: none !important;
                            border: none !important;
                            padding: 0 !important;
                            margin: 0 !important;
                        }
                    }
                `}
            </style>
        </React.Fragment>
    );
};

export default StudentBoardingPrint;
