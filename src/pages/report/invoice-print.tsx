import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getInvoiceReport } from "@/common/api/report";
import { formatCurrency } from "@/helpers";
import type {InvoiceDatatableType} from "@/types";
import PrintLayout from "./components/PrintLayout";
import { show as showInstitution } from "@/common/api/institution";

const InvoiceReportPrint = () => {
    const [searchParams] = useSearchParams();
    const [invoices, setInvoices] = useState<InvoiceDatatableType[]>([]);
    const [loading, setLoading] = useState(true);
    const [institutionName, setInstitutionName] = useState("Semua Lembaga");

    const yearId = searchParams.get("yearId");
    const institutionId = searchParams.get("institutionId");
    const gender = searchParams.get("gender");
    const programId = searchParams.get("programId");
    const boardingId = searchParams.get("boardingId");
    const status = searchParams.get("status");

    useEffect(() => {
        const fetchData = async () => {
            if (!yearId) return;

            setLoading(true);
            try {
                // Fetch institution name if filtered
                if (institutionId) {
                    await showInstitution({ id: institutionId }).then((resp) => {
                        setInstitutionName(resp?.surname || "");
                    });
                }

                const params: Record<string, any> = { type: 'datatable' };
                if (yearId) params.yearId = yearId;
                if (institutionId) params.institutionId = institutionId;
                if (gender) params.gender = gender;
                if (programId) params.programId = programId;
                if (boardingId) params.boardingId = boardingId;
                if (status) params.status = status;

                const resp = await getInvoiceReport<InvoiceDatatableType>(params);
                setInvoices(resp);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [yearId, institutionId, status]);

    const headerContent = (
        <>
            <div>
                <strong>Lembaga:</strong> {institutionName}
            </div>
            <div>
                <strong>Status:</strong> {status ? status : "Semua Status"}
            </div>
            <div>
                <strong>Total:</strong> {invoices.length} Tagihan
            </div>
        </>
    );

    return (
        <PrintLayout
            title="Cetak Laporan Tagihan"
            reportTitle="Laporan Tagihan"
            data={invoices}
            loading={loading}
            headerContent={headerContent}
            columnCount={6}
        >
            <thead className="table-light">
                <tr>
                    <th style={{ width: "50px" }} className="text-center">No</th>
                    <th>Nomor Invoice</th>
                    <th>Siswa</th>
                    <th>Program</th>
                    <th className="text-end">Tagihan</th>
                    <th className="text-end">Potongan</th>
                    <th className="text-end">Total</th>
                    <th className="text-end">Terbayar</th>
                    <th className="text-end">Sisa</th>
                    <th className="text-center">Status</th>
                </tr>
            </thead>
            <tbody>
                {invoices.map((invoice, index) => (
                    <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td>{invoice.reference || "-"}</td>
                        <td>{invoice.student_name}</td>
                        <td>{invoice.program_name}</td>
                        <td className="text-end">{formatCurrency(invoice.original_invoice)}</td>
                        <td className="text-end">{formatCurrency(invoice.discount)}</td>
                        <td className="text-end">{formatCurrency(invoice.original_amount)}</td>
                        <td className="text-end">{formatCurrency(invoice.payment)}</td>
                        <td className="text-end">{formatCurrency(invoice.unpaid)}</td>
                        <td className="text-center">{invoice.status}</td>
                    </tr>
                ))}
                <tr>
                    <td style={{ width: "50px" }} colSpan={4} className="text-center">Total</td>
                    <td className="text-end fw-bold">{formatCurrency(invoices.reduce((acc, item) => acc + item.original_invoice, 0))}</td>
                    <td className="text-end fw-bold">{formatCurrency(invoices.reduce((acc, item) => acc + item.discount, 0))}</td>
                    <td className="text-end fw-bold">{formatCurrency(invoices.reduce((acc, item) => acc + item.original_amount, 0))}</td>
                    <td className="text-end fw-bold">{formatCurrency(invoices.reduce((acc, item) => acc + item.payment, 0))}</td>
                    <td className="text-end fw-bold">{formatCurrency(invoices.reduce((acc, item) => acc + item.unpaid, 0))}</td>
                    <td className="text-center"></td>
                </tr>
            </tbody>
        </PrintLayout>
    );
};

export default InvoiceReportPrint;
