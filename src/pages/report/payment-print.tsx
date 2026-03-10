import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPaymentReport } from "@/common/api/report";
import { formatCurrency } from "@/helpers";
import { show as showInstitution } from "@/common/api/institution";
import PrintLayout from "./components/PrintLayout";
import moment from "moment";

type PaymentReportType = {
    id: number;
    name: string;
    reference: string;
    method: number;
    status: number;
    transaction_id: string;
    transaction_time: string;
    amount: number;
}

const PaymentReportPrint = () => {
    const [searchParams] = useSearchParams();
    const [payments, setPayments] = useState<PaymentReportType[]>([]);
    const [loading, setLoading] = useState(true);
    const [institutionName, setInstitutionName] = useState("Semua Lembaga");

    const yearId = searchParams.get("yearId");
    const institutionId = searchParams.get("institutionId");
    const method = searchParams.get("method");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

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
                if (method) params.method = method;
                if (dateFrom) params.dateFrom = dateFrom;
                if (dateTo) params.dateTo = dateTo;

                const resp = await getPaymentReport<PaymentReportType>(params);
                setPayments(resp);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [yearId, institutionId, method, dateFrom, dateTo]);

    const headerContent = (
        <>
            <div>
                <strong>Lembaga:</strong> {institutionName}
            </div>
            <div>
                <strong>Metode:</strong> {method ? (method === "1" ? "Cash" : "Midtrans") : "Semua Metode"}
            </div>
            {dateFrom && dateTo && (
                <div>
                    <strong>Periode:</strong> {moment(dateFrom).format("DD/MM/YYYY")} - {moment(dateTo).format("DD/MM/YYYY")}
                </div>
            )}
            <div>
                <strong>Total:</strong> {payments.length} Transaksi
            </div>
        </>
    );

    return (
        <PrintLayout
            title="Cetak Laporan Pembayaran"
            reportTitle="Laporan Pembayaran"
            data={payments}
            loading={loading}
            headerContent={headerContent}
            columnCount={6}
        >
            <thead className="table-light">
                <tr>
                    <th style={{ width: "50px" }} className="text-center">No</th>
                    <th>Waktu</th>
                    <th>Siswa</th>
                    <th>Invoice</th>
                    <th>Metode</th>
                    <th className="text-end">Jumlah</th>
                    <th>ID Transaksi</th>
                </tr>
            </thead>
            <tbody>
                {payments.map((payment, index) => (
                    <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td>{moment(payment.transaction_time).format("DD/MM/YYYY HH:mm")}</td>
                        {/* @ts-ignore */}
                        <td>{payment.name}</td>
                        {/* @ts-ignore */}
                        <td>{payment.reference || "-"}</td>
                        <td>{payment.method === 1 ? "Cash" : "Midtrans"}</td>
                        <td className="text-end">{formatCurrency(payment.amount)}</td>
                        <td>{payment.transaction_id}</td>
                    </tr>
                ))}
            </tbody>
        </PrintLayout>
    );
};

export default PaymentReportPrint;
