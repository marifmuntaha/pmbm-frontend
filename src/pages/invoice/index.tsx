import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { Badge, ButtonGroup, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Spinner } from "reactstrap";
import { formatCurrency, getStatusInvoice } from "@/helpers";
import Form from "./form";
import { get as getProduct } from "@/common/api/master/product";
import { studentInvoice } from "@/common/api/student";
import { sendWhatsapp } from "@/common/api/invoice";
import { useNavigate } from "react-router-dom";

// ---------------------------------------------------------------------------
// ActionCell — komponen terpisah agar state isOpen tidak menyebabkan
// Column array di-recreate
// ---------------------------------------------------------------------------
interface ActionCellProps {
    row: StudentInvoiceType;
    onGenerate: (row: StudentInvoiceType) => void;
    onEdit: (row: StudentInvoiceType) => void;
    onView: (invoiceId: number) => void;
    onSendWa: (invoiceId: number) => void;
}

const ActionCell = React.memo(({ row, onGenerate, onEdit, onView, onSendWa }: ActionCellProps) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Dropdown isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
            <DropdownToggle className="btn-action" color="light" size="xs">
                <Icon name="more-h" />
            </DropdownToggle>
            <DropdownMenu>
                <ul className="link-list-opt">
                    {!row.invoice ? (
                        <li>
                            <DropdownItem tag="a" href="#links" onClick={(e) => {
                                e.preventDefault();
                                onGenerate(row);
                            }}>
                                <Icon name="reload" className="text-danger" /><span>Generate Tagihan</span>
                            </DropdownItem>
                        </li>
                    ) : (
                        <>
                            {row.invoice.status !== 'PAID' && (
                                <li>
                                    <DropdownItem tag="a" href="#links" onClick={(e) => {
                                        e.preventDefault();
                                        onEdit(row);
                                    }}>
                                        <Icon name="pen" className="text-warning" /><span>Ubah Tagihan</span>
                                    </DropdownItem>
                                </li>
                            )}
                            <li>
                                <DropdownItem tag="a" href="#links" onClick={(e) => {
                                    e.preventDefault();
                                    onView(row.invoice?.id as number);
                                }}>
                                    <Icon name="eye" className="text-info" /><span>Detail Tagihan</span>
                                </DropdownItem>
                            </li>
                            <li>
                                <DropdownItem tag="a" href="#links" onClick={(e) => {
                                    e.preventDefault();
                                    onSendWa(row.invoice?.id as number);
                                }}>
                                    <Icon name="whatsapp" className="text-success" /><span>Kirim Tagihan</span>
                                </DropdownItem>
                            </li>
                        </>
                    )}
                </ul>
            </DropdownMenu>
        </Dropdown>
    );
});

// ---------------------------------------------------------------------------

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
    const [sendingBuckWa, setSendingBuckWa] = useState(false)
    const navigate = useNavigate()
    const handleGenerate = useCallback((student: StudentInvoiceType) => {
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
                setModal(prev => ({ ...prev, form: true }))
            });
    }, [year, institution]);

    const handleEdit = useCallback((row: StudentInvoiceType) => {
        setUser({ id: row.userId, address: row.address, period: row.period, verification: row.verification })
        setInvoice(row.invoice)
        setFormMode('edit')
        setModal(prev => ({ ...prev, form: true }));
    }, []);

    const handleView = useCallback((invoiceId: number) => {
        navigate(`/data-tagihan/${invoiceId}/lihat`);
    }, [navigate]);

    const handleSendWa = useCallback((invoiceId: number) => {
        sendWhatsapp(invoiceId).then(() => {
        });
    }, []);

    const Column = useMemo<ColumnType<StudentInvoiceType>[]>(() => [
        {
            name: "Nomor",
            selector: (row) => row?.invoice?.reference,
            sortable: true,
            width: "140px"
        },
        {
            name: "Nama",
            selector: (row) => row.name,
            sortable: true,
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
            name: "Program",
            selector: (row) => row?.program,
            sortable: true,
        },
        {
            name: "Jumlah",
            selector: (row) => row.invoice?.amount && formatCurrency(row.invoice.amount),
            sortable: false,
        },
        {
            name: "Status",
            selector: (row) => row.invoice?.status,
            sortable: true,
            cell: (row) => (
                <Badge pill color={getStatusInvoice(row.invoice?.status)}>{row.invoice?.status}</Badge>
            )
        },
        {
            name: "",
            selector: (row) => row?.userId,
            sortable: false,
            width: "80px",
            cell: (row) => (
                <ActionCell
                    row={row}
                    onGenerate={handleGenerate}
                    onEdit={handleEdit}
                    onView={handleView}
                    onSendWa={handleSendWa}
                />
            ),
        },
    ], [handleGenerate, handleEdit, handleView, handleSendWa]);

    const handleSendBuckWA = async () => {
        if (invoices.length === 0) return;
        setSendingBuckWa(true);

        try {
            for (let i = 0; i < invoices.length; i++) {
                const invoice = invoices[i];
                await sendWhatsapp(invoice.invoice?.id, false);

                if (i < invoices.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
            alert("Semua pesan berhasil dikirim!");
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            alert("Terjadi kesalahan saat mengirim pesan.");
        } finally {
            setSendingBuckWa(false);
        }
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
                                    <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                                        <ul className="nk-block-tools g-3">
                                            <li>
                                                <Button
                                                    color="success"
                                                    size="sm"
                                                    onClick={() => handleSendBuckWA()}
                                                    disabled={sendingBuckWa}
                                                >
                                                    {sendingBuckWa ? <Spinner size="sm" /> : <Icon name="whatsapp" />}
                                                    <span>KIRIM SEMUA</span>
                                                </Button>
                                            </li>
                                        </ul>
                                    </div>
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