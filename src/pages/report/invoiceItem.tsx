import React, { useEffect, useState } from "react";
import Head from "@/layout/head";
import { Block, BlockBetween, BlockHead, BlockHeadContent, BlockTitle, Icon, PreviewCard } from "@/components";
import { Button, Spinner } from "reactstrap";
import Content from "@/layout/content";
import { useYearContext } from "@/common/hooks/useYearContext";
import { getItemReport, exportItemReport } from "@/common/api/report";
import type { ProductType } from "@/types";
import { useAuthContext } from "@/common/hooks/useAuthContext";
import { formatCurrency } from "@/helpers";

const InvoiceReportItem = () => {
    const year = useYearContext();
    const { user } = useAuthContext();
    const [products, setProducts] = useState<ProductType[]>([]);
    const [loadData, setLoadData] = useState(true);

    useEffect(() => {
        let cancelled = false;

        setLoadData(true);
        getItemReport<ProductType>({
            type: 'report',
            yearId: year?.id,
            institutionId: user?.institutionId,
        }).then((response) => {
            if (!cancelled) setProducts(response);
        }).finally(() => {
            if (!cancelled) setLoadData(false);
        });

        return () => {
            cancelled = true;
        };
    }, [year, user?.institutionId]);

    const handlePrint = () => {
        const params: string[] = [];
        if (year?.id) params.push(`yearId=${year.id}`);
        if (user?.institutionId) params.push(`institutionId=${user.institutionId}`);
        window.open(`/laporan/tagihan-item/cetak?${params.join("&")}`, "_blank");
    };

    const handleExport = () => {
        const params: Record<string, any> = {};
        if (year?.id) params.yearId = year.id;
        if (user?.institutionId) params.institutionId = user.institutionId;
        exportItemReport(params);
    };

    const totalInvoice = products.reduce((acc, p) => acc + (p.invoice ?? 0), 0);
    const totalDiscount = products.reduce((acc, p) => acc + (p.discount ?? 0), 0);
    const totalNet = totalInvoice - totalDiscount;

    return (
        <React.Fragment>
            <Head title="Laporan Tagihan Per Item" />
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Laporan Tagihan Per Item</BlockTitle>
                                <p>
                                    Rekapitulasi data tagihan Tahun Ajaran {year?.name}
                                </p>
                            </BlockHeadContent>
                            <BlockHeadContent>
                                <Button color="success" outline onClick={handlePrint} className="me-2">
                                    <Icon name="printer" />
                                    <span className="d-none d-sm-inline-block">Cetak</span>
                                </Button>
                                <Button color="info" outline onClick={handleExport}>
                                    <Icon name="file-xls" />
                                    <span className="d-none d-sm-inline-block">Export</span>
                                </Button>
                            </BlockHeadContent>
                        </BlockBetween>
                    </BlockHead>
                    <PreviewCard>
                        {loadData ? (
                            <div className="text-center py-4">
                                <Spinner color="primary" />
                            </div>
                        ) : (
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Nama Item</th>
                                        <th scope="col" className="text-end">Saldo Tagihan</th>
                                        <th scope="col" className="text-end">Saldo Potongan</th>
                                        <th scope="col" className="text-end">Jumlah</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((item, num) => (
                                        <tr key={item.id}>
                                            <th scope="row">{num + 1}</th>
                                            <td>{item.name}</td>
                                            <td className="text-end">{formatCurrency(item.invoice)}</td>
                                            <td className="text-end">{formatCurrency(item.discount)}</td>
                                            <td className="text-end">{formatCurrency((item.invoice ?? 0) - (item.discount ?? 0))}</td>
                                        </tr>
                                    ))}
                                    <tr className="fw-bold table-secondary">
                                        <th scope="row" colSpan={2} className="text-center">Jumlah</th>
                                        <td className="text-end">{formatCurrency(totalInvoice)}</td>
                                        <td className="text-end">{formatCurrency(totalDiscount)}</td>
                                        <td className="text-end">{formatCurrency(totalNet)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </PreviewCard>
                </Block>
            </Content>
        </React.Fragment>
    );
};

export default InvoiceReportItem;