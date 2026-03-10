import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getDiscountReport } from "@/common/api/report";
import { formatCurrency } from "@/helpers";
import { show as showInstitution } from "@/common/api/institution";
import PrintLayout from "./components/PrintLayout";

interface DiscountType {
    id: number;
    studentName: string;
    productName: string;
    amount: number;
    description: string;
    created_at: string;
}

const DiscountsReportPrint = () => {
    const [searchParams] = useSearchParams();
    const [discounts, setDiscounts] = useState<DiscountType[]>([]);
    const [loading, setLoading] = useState(true);
    const [institutionName, setInstitutionName] = useState("Semua Lembaga");

    const yearId = searchParams.get("yearId");
    const institutionId = searchParams.get("institutionId");

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

                const resp = await getDiscountReport<DiscountType>(params);
                setDiscounts(resp);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [yearId, institutionId]);

    const headerContent = (
        <>
            <div>
                <strong>Lembaga:</strong> {institutionName}
            </div>
            <div>
                <strong>Total:</strong> {discounts.length} Data
            </div>
        </>
    );

    return (
        <PrintLayout
            title="Cetak Laporan Potongan"
            reportTitle="Laporan Potongan"
            data={discounts}
            loading={loading}
            headerContent={headerContent}
            columnCount={5}
        >
            <thead className="table-light">
                <tr>
                    <th style={{ width: "50px" }} className="text-center">No</th>
                    <th>Nama Siswa</th>
                    <th>Item Pembayaran</th>
                    <th>Jumlah Potongan</th>
                    <th>Keterangan</th>
                </tr>
            </thead>
            <tbody>
                {discounts.map((discount, index) => (
                    <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        {/* @ts-ignore */}
                        <td>{discount.studentName}</td>
                        {/* @ts-ignore */}
                        <td>{discount.productName}</td>
                        <td>{formatCurrency(discount.amount)}</td>
                        <td>{discount.description}</td>
                    </tr>
                ))}
            </tbody>
        </PrintLayout>
    );
};

export default DiscountsReportPrint;
