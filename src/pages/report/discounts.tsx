import React, { useEffect, useState } from "react";
import Head from "@/layout/head";
import Content from "@/layout/content";
import {
    Block,
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    PreviewCard,
    ReactDataTable,
    RSelect,
    Icon,
} from "@/components";
import { useYearContext } from "@/common/hooks/useYearContext";
import { Button, FormGroup, Label, Row, Col } from "reactstrap";
import { getDiscountReport, exportDiscountReport } from "@/common/api/report";
import { formatCurrency } from "@/helpers";
import type { ColumnType, OptionsType } from "@/types";
import { useAuthContext } from "@/common/hooks/useAuthContext";
import { get as getInstitution } from "@/common/api/institution";

interface DiscountType {
    id: number;
    studentName: string;
    productName: string;
    amount: number;
    description: string;
    created_at: string;
}

const DiscountsReport = () => {
    const year = useYearContext();
    const { user } = useAuthContext();
    const [loadData, setLoadData] = useState(true);
    const [discounts, setDiscounts] = useState<DiscountType[]>([]);
    const [institutions, setInstitutions] = useState<OptionsType[]>([]);
    const [institutionId, setInstitutionId] = useState(user?.institutionId ? user.institutionId : 0);

    const Column: ColumnType<DiscountType>[] = [
        {
            name: "Nama Siswa",
            selector: (row) => row.studentName,
            sortable: true,
        },
        {
            name: "Item Pembayaran",
            selector: (row) => row.productName,
            sortable: true,
        },
        {
            name: "Jumlah Potongan",
            selector: (row) => formatCurrency(row.amount),
            sortable: true,
        },
        {
            name: "Keterangan",
            selector: (row) => row.description,
            sortable: true,
        },
        {
            name: "Tanggal Dibuat",
            selector: (row) => row.created_at,
            sortable: true,
        },
    ];

    // Load institutions
    useEffect(() => {
        const fetchData = async () => {
            await getInstitution<OptionsType>({ type: 'select' }).then((resp) => {
                setInstitutions(resp)
            })
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (user?.institutionId) {
            setInstitutionId(user.institutionId);
        }
    }, [user]);

    // Fetch report data
    useEffect(() => {
        if (year?.id) {
            setLoadData(true);
            const params: Record<string, any> = {
                yearId: year.id,
            };
            if (institutionId) {
                params.institutionId = institutionId;
            }
            getDiscountReport<DiscountType>(params)
                .then((resp) => {
                    setDiscounts(resp);
                })
                .finally(() => {
                    setLoadData(false);
                });
        }
    }, [year, institutionId, user]);

    const handleExport = () => {
        const params: Record<string, any> = {
            yearId: year?.id,
        };
        if (institutionId) {
            params.institutionId = institutionId;
        }
        exportDiscountReport(params);
    };

    const handlePrint = () => {
        const params: string[] = [];
        if (year?.id) params.push(`yearId=${year.id}`);
        if (institutionId) params.push(`institutionId=${institutionId}`);

        window.open(`/laporan/potongan/cetak?${params.join("&")}`, "_blank");
    };

    return (
        <React.Fragment>
            <Head title="Laporan Potongan" />
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Laporan Potongan</BlockTitle>
                                <p>
                                    Rekapitulasi potongan pembayaran Tahun Ajaran {year?.name}
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
                        <Row className="gy-4 mb-4">
                            <Col sm={4}>
                                <FormGroup>
                                    <Label>Lembaga</Label>
                                    <RSelect
                                        options={[{ value: 0, label: "Semua Lembaga" }, ...institutions]}
                                        value={institutions.find(opt => opt.value == institutionId) || { value: 0, label: "Semua Lembaga" }}
                                        onChange={(opt) => setInstitutionId(opt?.value || 0)}
                                        placeholder="Pilih Lembaga..."
                                        isDisabled={!!user?.institutionId}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <ReactDataTable
                            data={discounts}
                            columns={Column}
                            pagination
                            progressPending={loadData}
                        />
                    </PreviewCard>
                </Block>
            </Content>
        </React.Fragment>
    );
};

export default DiscountsReport;
