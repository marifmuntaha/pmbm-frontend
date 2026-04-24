import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getItemReport } from "@/common/api/report";
import { formatCurrency } from "@/helpers";
import type { ProductType } from "@/types";
import PrintLayout from "./components/PrintLayout";
import { show as showInstitution } from "@/common/api/institution";

const InvoiceItemReportPrint = () => {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true);
    const [institutionName, setInstitutionName] = useState("Semua Lembaga");

    const yearId = searchParams.get("yearId");
    const institutionId = searchParams.get("institutionId");

    useEffect(() => {
        const fetchData = async () => {
            if (!yearId) return;

            setLoading(true);
            try {
                if (institutionId) {
                    await showInstitution({ id: institutionId }).then((resp) => {
                        setInstitutionName(resp?.surname || "");
                    });
                }

                const params: Record<string, any> = { type: 'report' };
                if (yearId) params.yearId = yearId;
                if (institutionId) params.institutionId = institutionId;

                const resp = await getItemReport<ProductType>(params);
                setProducts(resp);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [yearId, institutionId]);

    const totalInvoice = products.reduce((acc, p) => acc + (p.invoice ?? 0), 0);
    const totalDiscount = products.reduce((acc, p) => acc + (p.discount ?? 0), 0);
    const totalNet = totalInvoice - totalDiscount;

    const headerContent = (
        <>
            <div>
                <strong>Lembaga:</strong> {institutionName}
            </div>
            <div>
                <strong>Total:</strong> {products.length} Item
            </div>
        </>
    );

    return (
        <PrintLayout
            title="Cetak Laporan Tagihan Per Item"
            reportTitle="Laporan Tagihan Per Item"
            data={products}
            loading={loading}
            headerContent={headerContent}
            columnCount={5}
        >
            <thead className="table-light">
                <tr>
                    <th style={{ width: "50px" }} className="text-center">No</th>
                    <th>Nama Item</th>
                    <th className="text-end">Saldo Tagihan</th>
                    <th className="text-end">Saldo Potongan</th>
                    <th className="text-end">Jumlah</th>
                </tr>
            </thead>
            <tbody>
                {products.map((item, index) => (
                    <tr key={item.id}>
                        <td className="text-center">{index + 1}</td>
                        <td>{item.name}</td>
                        <td className="text-end">{formatCurrency(item.invoice)}</td>
                        <td className="text-end">{formatCurrency(item.discount)}</td>
                        <td className="text-end">{formatCurrency((item.invoice ?? 0) - (item.discount ?? 0))}</td>
                    </tr>
                ))}
                <tr>
                    <td colSpan={2} className="text-center fw-bold">Total</td>
                    <td className="text-end fw-bold">{formatCurrency(totalInvoice)}</td>
                    <td className="text-end fw-bold">{formatCurrency(totalDiscount)}</td>
                    <td className="text-end fw-bold">{formatCurrency(totalNet)}</td>
                </tr>
            </tbody>
        </PrintLayout>
    );
};

export default InvoiceItemReportPrint;
