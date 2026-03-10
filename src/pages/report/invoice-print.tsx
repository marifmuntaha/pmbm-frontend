import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getInvoiceReport } from "@/common/api/report";
import { formatCurrency } from "@/helpers";
import type { InvoiceType } from "@/types";
import PrintLayout from "./components/PrintLayout";
import { show as showInstitution } from "@/common/api/institution";

const InvoiceReportPrint = () => {
    const [searchParams] = useSearchParams();
    const [invoices, setInvoices] = useState<InvoiceType[]>([]);
    const [loading, setLoading] = useState(true);
    const [institutionName, setInstitutionName] = useState("Semua Lembaga");

    const yearId = searchParams.get("yearId");
    const institutionId = searchParams.get("institutionId");
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

                const params: Record<string, any> = { yearId };
                if (institutionId) params.institutionId = institutionId;
                if (status) params.status = status;

                const resp = await getInvoiceReport<InvoiceType>(params);
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
                    <th className="text-end">Jumlah</th>
                    <th>Jatuh Tempo</th>
                    <th className="text-center">Status</th>
                </tr>
            </thead>
            <tbody>
                {invoices.map((invoice, index) => (
                    <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td>{invoice.reference || "-"}</td>
                        {/* @ts-ignore */}
                        <td>{invoice.student_name}</td>
                        {/* @ts-ignore */}
                        <td className="text-end">{formatCurrency(invoice.original_amount)}</td>
                        <td>{invoice.dueDate}</td>
                        <td className="text-center">{invoice.status}</td>
                    </tr>
                ))}
            </tbody>
        </PrintLayout>
    );
};

export default InvoiceReportPrint;
