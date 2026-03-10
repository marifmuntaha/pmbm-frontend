import React, { useEffect } from "react";
import Head from "@/layout/head";
import moment from "moment";
import { useYearContext } from "@/common/hooks/useYearContext";

interface PrintLayoutProps {
    title: string;
    reportTitle: string;
    data: any[];
    loading: boolean;
    headerContent?: React.ReactNode;
    children: React.ReactNode;
    columnCount?: number;
}

const PrintLayout: React.FC<PrintLayoutProps> = ({
    title,
    reportTitle,
    data,
    loading,
    headerContent,
    children,
    columnCount = 1
}) => {
    const yearContext = useYearContext();

    useEffect(() => {
        if (!loading && data.length > 0) {
            setTimeout(() => {
                window.print();
            }, 500);
        }
    }, [loading, data]);

    return (
        <React.Fragment>
            <Head title={title} />
            <div className="p-4 bg-white" style={{ minHeight: "100vh" }}>
                <div className="text-center mb-4">
                    <h3 className="mb-1">{reportTitle}</h3>
                    <h5 className="text-muted mb-3">Tahun Ajaran {yearContext?.name}</h5>

                    {headerContent && (
                        <div className="d-flex justify-content-center gap-4 text-sm flex-wrap">
                            {headerContent}
                        </div>
                    )}
                </div>

                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        {children}
                        {loading && (
                            <tbody>
                                <tr>
                                    <td colSpan={columnCount} className="text-center py-4">Memuat data...</td>
                                </tr>
                            </tbody>
                        )}
                        {!loading && data.length === 0 && (
                            <tbody>
                                <tr>
                                    <td colSpan={columnCount} className="text-center py-4">Tidak ada data ditemukan</td>
                                </tr>
                            </tbody>
                        )}
                    </table>
                </div>

                <div className="mt-4 text-end text-muted small">
                    Dicetak pada: {moment().format("DD/MM/YYYY HH:mm")}
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

export default PrintLayout;
