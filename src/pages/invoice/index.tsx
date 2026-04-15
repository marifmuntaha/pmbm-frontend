import React, { useEffect, useState } from "react";
import Head from "@/layout/head";
import Content from "@/layout/content";
import {
    Block,
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Button,
    Icon, PreviewCard, ReactDataTable,
} from "@/components";
import { useYearContext } from "@/common/hooks/useYearContext";
import { useInstitutionContext } from "@/common/hooks/useInstitutionContext";
import type {
    ColumnType,
    InvoiceType,
    ModalInvoiceType,
    ProductType,
    StudentInvoiceType,
    StudentVerificationType
} from "@/types";
import { Badge, ButtonGroup } from "reactstrap";
import { formatCurrency, getStatusInvoice } from "@/helpers";
import Form from "./form";
import { get as getProduct } from "@/common/api/master/product";
import { studentInvoice } from "@/common/api/student";
import { sendWhatsapp } from "@/common/api/invoice";
import { useNavigate } from "react-router-dom";

const Invoice = () => {
    const year = useYearContext()
    const institution = useInstitutionContext()
    const [sm, updateSm] = useState(false)
    const [loadData, setLoadData] = useState(true)
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
    const [modal, setModal] = useState<ModalInvoiceType>({
        form: false,
        show: false,
    })
    const [user, setUser] = useState<{ id?: number, address: string, period?: string, verification: StudentVerificationType | undefined }>()
    const [products, setProducts] = useState<ProductType[]>([])
    const [invoices, setInvoices] = useState<StudentInvoiceType[]>([])
    const [invoice, setInvoice] = useState<InvoiceType>()
    const navigate = useNavigate()
    const Column: ColumnType<StudentInvoiceType>[] = [
        {
            name: "Nomor",
            selector: (row) => row?.invoice?.reference,
            sortable: false,
        },
        {
            name: "Nama",
            selector: (row) => row.name,
            sortable: false,
            width: "350px"
        },
        {
            name: "Wali",
            selector: (row) => row.guardName,
            sortable: false,
        },
        {
            name: "Alamat",
            selector: (row) => row.address,
            sortable: false,
        },
        {
            name: "Jumlah",
            selector: (row) => row.invoice?.amount && formatCurrency(row.invoice.amount),
            sortable: false,
        },
        {
            name: "Status",
            selector: (row) => row.invoice?.status,
            sortable: false,
            cell: (row) => (
                <Badge pill color={getStatusInvoice(row.invoice?.status)}>{row.invoice?.status}</Badge>
            )
        },
        {
            name: "Aksi",
            selector: (row) => row?.userId,
            sortable: false,
            width: "150px",
            cell: (row) => (
                <ButtonGroup size="sm">
                    {row.invoice ? row.invoice.status !== 'PAID' && (
                        (
                            <React.Fragment>
                                <Button outline color="warning" onClick={() => {
                                    setUser({ id: row.userId, address: row.address, period: row.period, verification: row.verification })
                                    setInvoice(row.invoice)
                                    setFormMode('edit')
                                    setModal({ ...modal, form: true });
                                }}>
                                    <Icon name="pen" />
                                </Button>
                                <Button outline color="info" onClick={() => navigate(`/data-tagihan/${row.invoice?.id}/lihat`)}>
                                    <Icon name="eye" />
                                </Button>
                            </React.Fragment>
                        )
                    ) : (
                        <Button outline color="danger" onClick={() => {
                            handleGenerate(row)
                        }}>
                            <Icon name="reload" />
                        </Button>
                    )}
                    {row.invoice && (
                        <Button outline color="success" onClick={() => {
                            sendWhatsapp(row.invoice?.id).then(() => {
                                // Notification is handled by the api core directly
                            });
                        }}>
                            <Icon name="whatsapp" />
                        </Button>
                    )}
                </ButtonGroup>
            ),
        },
    ];
    const handleGenerate = (student: StudentInvoiceType) => {
        getProduct<ProductType>({ yearId: year?.id, institutionId: institution?.id })
            .then((resp) => {
                let products: ProductType[]
                const products1 = resp.filter((item) => item.gender === 0 && item.programId === 0 && item.isBoarding === 2);
                const products2 = resp.filter((item) => item.gender === 0 && item.programId === student.programId && item.isBoarding === 2);
                const products3 = resp.filter((item) => item.gender === student.gender && item.programId === 0 && item.isBoarding === 2);
                const products4 = resp.filter((item) => item.gender === student.gender && item.programId === student.programId && item.isBoarding === 2);
                products = [
                    ...products1,
                    ...products2,
                    ...products3,
                    ...products4
                ]
                if (student.boardingId !== 1) {
                    const products5 = resp.filter((item) => item.gender === 0 && item.boardingId === 0 && item.isBoarding === 1);
                    const products6 = resp.filter((item) => item.gender === 0 && item.boardingId === student.boardingId && item.isBoarding === 1);
                    const products7 = resp.filter((item) => item.gender === student.gender && item.boardingId === 0 && item.isBoarding === 1);
                    const products8 = resp.filter((item) => item.gender === student.gender && item.boardingId === student.boardingId && item.isBoarding === 1);
                    products = [
                        ...products,
                        ...products5,
                        ...products6,
                        ...products7,
                        ...products8
                    ]
                }
                setProducts(products)
                setUser({ id: student.userId, address: student.address, period: student.period, verification: student.verification })
                setFormMode('create')
                setModal({ ...modal, form: true })
            });

    }
    useEffect(() => {
        if (loadData) studentInvoice({ yearId: year?.id, institutionId: institution?.id })
            .then((resp) => setInvoices(resp))
            .finally(() => setLoadData(false));
    }, [loadData]);

    return (
        <React.Fragment>
            <Head title="Data Tagihan" />
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Data Tagihan</BlockTitle>
                                <p>
                                    Data Tagihan Pendaftaran {institution?.surname} Tahun Ajaran {year?.name}
                                </p>
                            </BlockHeadContent>
                            <BlockHeadContent>
                                <div className="toggle-wrap nk-block-tools-toggle">
                                    <Button
                                        className={`btn-icon btn-trigger toggle-expand me-n1 ${sm ? "active" : ""}`}
                                        onClick={() => updateSm(!sm)}
                                    >
                                        <Icon name="menu-alt-r" />
                                    </Button>
                                </div>
                            </BlockHeadContent>
                        </BlockBetween>
                    </BlockHead>
                    <PreviewCard>
                        <ReactDataTable data={invoices} columns={Column} pagination progressPending={loadData} />
                    </PreviewCard>
                </Block>
                <Form
                    isOpen={modal.form}
                    toggle={() => setModal({ ...modal, form: !modal.form })}
                    mode={formMode}
                    user={user}
                    products={products}
                    invoice={invoice}
                    setLoadData={setLoadData}
                />
            </Content>
        </React.Fragment >
    )
}

export default Invoice