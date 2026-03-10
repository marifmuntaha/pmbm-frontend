import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getApplicantReport } from "@/common/api/report";
import { getGender } from "@/helpers";
import { show as showInstitution } from "@/common/api/institution";
import PrintLayout from "./components/PrintLayout";

type ApplicantType = {
    id: number;
    name: string;
    nisn: string;
    gender: number;
    institution: string;
    program: string;
    boarding: string;
    verified: boolean;
    created_at: string;
}

const ApplicantsReportPrint = () => {
    const [searchParams] = useSearchParams();
    const [applicants, setApplicants] = useState<ApplicantType[]>([]);
    const [loading, setLoading] = useState(true);
    const [institutionName, setInstitutionName] = useState("Semua Lembaga");

    const yearId = searchParams.get("yearId");
    const institutionId = searchParams.get("institutionId");
    const programId = searchParams.get("programId");
    const boardingId = searchParams.get("boardingId");
    const status = searchParams.get("status");

    useEffect(() => {
        const fetchData = async () => {
            if (!yearId) return;

            setLoading(true);
            try {
                if (institutionId && institutionId !== "0") {
                    const institution = await showInstitution({ id: institutionId })
                    if (institution) setInstitutionName(institution.surname)
                }

                const params: Record<string, any> = { yearId };
                if (institutionId && institutionId !== "0") params.institutionId = institutionId;
                if (programId && programId !== "0") params.programId = programId;
                if (boardingId && boardingId !== "0") params.boardingId = boardingId;
                if (status) params.status = status;

                const resp = await getApplicantReport<ApplicantType>(params);
                setApplicants(resp);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [yearId, institutionId, programId, boardingId, status]);

    const headerContent = (
        <>
            <div>
                <strong>Lembaga:</strong> {institutionName}
            </div>
            <div>
                <strong>Status:</strong> {status === "verified" ? "Terverifikasi" : status === "pending" ? "Pending" : "Semua Status"}
            </div>
            <div>
                <strong>Total:</strong> {applicants.length} Siswa
            </div>
        </>
    );

    return (
        <PrintLayout
            title="Cetak Laporan Pendaftar"
            reportTitle="Laporan Pendaftar"
            data={applicants}
            loading={loading}
            headerContent={headerContent}
            columnCount={8}
        >
            <thead className="table-light">
                <tr>
                    <th style={{ width: "50px" }} className="text-center">No</th>
                    <th>Nama</th>
                    <th>NISN</th>
                    <th>L/P</th>
                    <th>Lembaga</th>
                    <th>Program</th>
                    <th>Boarding</th>
                    <th className="text-center">Status</th>
                </tr>
            </thead>
            <tbody>
                {applicants.map((applicant, index) => (
                    <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td>{applicant.name}</td>
                        <td>{applicant.nisn}</td>
                        <td>{getGender(applicant.gender)}</td>
                        <td>{applicant.institution}</td>
                        <td>{applicant.program}</td>
                        <td>{applicant.boarding}</td>
                        <td className="text-center">
                            {applicant.verified ? 'Verified' : 'Pending'}
                        </td>
                    </tr>
                ))}
            </tbody>
        </PrintLayout>
    );
};

export default ApplicantsReportPrint;
