import { useEffect, useMemo, useState } from "react";
import { Button, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, ModalHeader, Spinner, UncontrolledButtonDropdown } from "reactstrap";
import { Icon } from "@/components";
import type {
    InstitutionType,
    InvoiceDetailType,
    InvoiceType,
    ProductType,
    StudentVerificationType
} from "@/types";
import { formatCurrency, formatNumber } from "@/helpers";
import { useInstitutionContext } from "@/common/hooks/useInstitutionContext";
import { get as getInstitution } from "@/common/api/institution";
import { store as storeInvoice, update as updateInvoice } from "@/common/api/invoice";
import { store as storeInvoiceDetail, get as getInvoiceDetail, update as updateInvoiceDetail } from "@/common/api/invoiceDetail";
import { useYearContext } from "@/common/hooks/useYearContext";

interface FormProps {
    isOpen: boolean;
    toggle: () => void;
    mode: 'create' | 'edit';
    user?: { id?: number, address: string, period?: string, verification?: StudentVerificationType };
    products?: ProductType[]; // For create mode
    invoice?: InvoiceType; // For edit mode
    setLoadData: (loadData: boolean) => void;
}

interface FormInvoiceDetailType extends InvoiceDetailType {
    discountType?: '%' | 'Rp';
    discountValue?: number;
}

const Form = ({ isOpen, toggle, mode, user, products = [], invoice, setLoadData }: FormProps) => {
    const year = useYearContext();
    const institution = useInstitutionContext();
    const [loading, setLoading] = useState(false);
    const [invoiceDetail, setInvoiceDetail] = useState<FormInvoiceDetailType[]>([]);
    const [institutionData, setInstitutionData] = useState<InstitutionType[]>();

    const onSubmit = () => {
        setLoading(true);
        const invoiceData: InvoiceType = {
            yearId: year?.id,
            institutionId: institution?.id,
            userId: user?.id,
            name: 'Tagihan PMB ' + institution?.surname,
            amount: invoiceDetail?.reduce((sum: number, item: InvoiceDetailType) => sum + item.amount, 0) || 0,
            dueDate: '2026-06-30',
            status: 'UNPAID'
        };

        if (mode === 'edit') {
            invoiceData.id = invoice?.id;
        }

        const apiCall = mode === 'create' ? storeInvoice(invoiceData) : updateInvoice(invoiceData);

        apiCall.then((resp) => {
            if (resp.status === 'success') {
                const invoiceId = mode === 'create' ? resp.result?.id : invoice?.id;

                // Handle invoice details
                const detailPromises = invoiceDetail.map((item) => {
                    const invoiceDetailData: InvoiceDetailType = {
                        invoiceId: invoiceId,
                        productId: item.productId, // Ensure productId is set
                        name: item.name,
                        price: item.price,
                        discount: item.discount,
                        amount: item.amount,
                    };

                    if (mode === 'edit') {
                        invoiceDetailData.id = item.id;
                        return updateInvoiceDetail(invoiceDetailData, false);
                    } else {
                        return storeInvoiceDetail(invoiceDetailData, false);
                    }
                });

                Promise.all(detailPromises).then(() => {
                    setLoadData(true);
                    toggle();
                });
            }
        }).finally(() => setLoading(false));
    };

    const amount: number = useMemo(() => {
        const amount = invoiceDetail?.reduce((sum: number, item: InvoiceDetailType) => sum + item.amount, 0);
        return amount !== undefined ? amount : 0;
    }, [invoiceDetail]);

    // Effect for Create Mode: Initialize from products
    useEffect(() => {
        if (mode === 'create' && products.length > 0 && isOpen) {
            setInvoiceDetail(products.map((product): FormInvoiceDetailType => ({
                productId: product.id,
                name: product.name,
                price: product.price ?? 0,
                discount: 0,
                amount: product.price ?? 0,
                discountType: 'Rp',
                discountValue: 0
            })));
        }
    }, [mode, products, isOpen]);

    // Effect for Edit Mode: Fetch existing details
    useEffect(() => {
        if (mode === 'edit' && invoice?.id && isOpen) {
            getInvoiceDetail<InvoiceDetailType>({ invoiceId: invoice.id }).then((resp) => {
                setInvoiceDetail(resp.map(item => ({
                    ...item,
                    discountType: 'Rp',
                    discountValue: item.discount
                })));
            });
        }
    }, [mode, invoice, isOpen]);

    useEffect(() => {
        const institutionHandle = () => {
            if (institution?.id)
                getInstitution<InstitutionType>({ id: institution.id - 1 }).then((resp) => {
                    if (resp.length > 0) setInstitutionData(resp);
                });
        };
        institutionHandle();
    }, [institution]);

    return (
        <Modal isOpen={isOpen} toggle={toggle} size="lg">
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross" />
                </button>
            }>
                {mode === 'create' ? 'Buat Tagihan' : 'Ubah Tagihan'}
            </ModalHeader>
            <ModalBody>
                <div className="table-responsive">
                    <table className="table border">
                        <thead>
                            <tr>
                                <td >Item</td>
                                <td className="text-end">Harga</td>
                                <td className="text-end">Potongan</td>
                                <td className="text-end">Jumlah</td>
                                <td className="text-center" style={{ width: '50px' }}>Aksi</td>
                            </tr>
                        </thead>
                        <tbody>
                            {invoiceDetail?.map((item, idx: number) => (
                                <tr key={idx}>
                                    <td>{item.name}</td>
                                    <td className="text-end align-content-center">{formatCurrency(item.price)}</td>
                                    <td>
                                        <div className="form-control-wrap">
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    className="form-control text-end"
                                                    id={`discount-${item.productId}`}
                                                    name={`discount[${item.productId}]`}
                                                    placeholder={item.discountType === '%' ? "Ex. 10" : "Ex. 50000"}
                                                    value={item.discountType === '%' ? (item.discountValue || "") : (formatCurrency(item.discountValue || 0) || "")}
                                                    onChange={(e) => {
                                                        const rawValue = e.target.value;
                                                        const newDiscountValue = item.discountType === '%' ? Number(rawValue.replace(/[^0-9.]/g, '')) : formatNumber(rawValue);
                                                        setInvoiceDetail((prevItems) =>
                                                            prevItems?.map((j) => {
                                                                if (j.productId === item.productId) {
                                                                    const calcDiscount = j.discountType === '%' ? (j.price * newDiscountValue / 100) : newDiscountValue;
                                                                    return {
                                                                        ...j,
                                                                        discountValue: newDiscountValue,
                                                                        discount: calcDiscount,
                                                                        amount: j.price - calcDiscount
                                                                    };
                                                                }
                                                                return j;
                                                            })
                                                        );
                                                    }}
                                                />
                                                <UncontrolledButtonDropdown className="input-group-append">
                                                    <DropdownToggle tag="button" className="btn btn-outline-primary btn-dim dropdown-toggle">
                                                        <span>{item.discountType === '%' ? '%' : 'Rp'}</span>
                                                        <Icon name="chevron-down" className="mx-n1 ms-1"></Icon>
                                                    </DropdownToggle>
                                                    <DropdownMenu>
                                                        <ul className="link-list-opt no-bdr">
                                                            <li>
                                                                <DropdownItem tag="a" href="#rp" onClick={(ev) => {
                                                                    ev.preventDefault();
                                                                    setInvoiceDetail((prevItems) =>
                                                                        prevItems?.map((j) => {
                                                                            if (j.productId === item.productId) {
                                                                                if (j.discountType === 'Rp') return j;
                                                                                const newDiscountValue = Math.round(j.price * (j.discountValue || 0) / 100);
                                                                                return {
                                                                                    ...j,
                                                                                    discountType: 'Rp',
                                                                                    discountValue: newDiscountValue,
                                                                                    discount: newDiscountValue,
                                                                                    amount: j.price - newDiscountValue
                                                                                };
                                                                            }
                                                                            return j;
                                                                        })
                                                                    );
                                                                }}>Rp</DropdownItem>
                                                            </li>
                                                            <li>
                                                                <DropdownItem tag="a" href="#percent" onClick={(ev) => {
                                                                    ev.preventDefault();
                                                                    setInvoiceDetail((prevItems) =>
                                                                        prevItems?.map((j) => {
                                                                            if (j.productId === item.productId) {
                                                                                if (j.discountType === '%') return j;
                                                                                const currentRp = j.discountValue || 0;
                                                                                let newDiscountValue = j.price > 0 ? (currentRp / j.price) * 100 : 0;
                                                                                newDiscountValue = Math.round(newDiscountValue * 100) / 100;
                                                                                const calcDiscount = (j.price * newDiscountValue / 100);
                                                                                return {
                                                                                    ...j,
                                                                                    discountType: '%',
                                                                                    discountValue: newDiscountValue,
                                                                                    discount: calcDiscount,
                                                                                    amount: j.price - calcDiscount
                                                                                };
                                                                            }
                                                                            return j;
                                                                        })
                                                                    );
                                                                }}>%</DropdownItem>
                                                            </li>
                                                        </ul>
                                                    </DropdownMenu>
                                                </UncontrolledButtonDropdown>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-end">{formatCurrency(item.amount)}</td>
                                    <td className="text-center">
                                        <Button
                                            size="sm"
                                            color="danger"
                                            outline
                                            onClick={() => {
                                                setInvoiceDetail((prev) =>
                                                    prev.filter((_, i) => i !== idx)
                                                );
                                            }}
                                        >
                                            <Icon name="trash" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td className="fw-bold text-end" colSpan={4}>TOTAL :</td>
                                <td className="fw-bold text-end">{formatCurrency(amount)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {user?.verification && (
                    <div className="table-responsive">
                        <table className="table border">
                            <tbody>
                                <tr>
                                    <td>{user.period}</td>
                                </tr>
                                {user.verification.twins === 1 && (
                                    <tr>
                                        <td>Pendaftar punya saudara kembar di {institution?.surname} dengan Nama {user.verification.twinsName}</td>
                                    </tr>
                                )}
                                {user.verification.domicile === 1 && (
                                    <tr>
                                        <td>Pendaftar berdomisili di Menganti</td>
                                    </tr>
                                )}
                                {user.verification.graduate === 1 && (
                                    <tr>
                                        <td>Pendaftar alumni dari {institutionData?.find((item) => institution?.id && item.id === institution.id - 1)?.surname}</td>
                                    </tr>
                                )}
                                {user.verification.teacherSon === 1 && (
                                    <tr>
                                        <td>Pendaftar anak dari Guru/Karyawan Yayasan Darul Hikmah Menganti</td>
                                    </tr>
                                )}
                                {user.verification.sibling === 1 && (
                                    <tr>
                                        <td>
                                            Pendaftar mempunyai saudara kandung di
                                            {institutionData?.find((item) => user.verification?.siblingInstitution && item.id === user.verification.siblingInstitution - 1)?.surname}
                                            dengan Nama {user.verification.siblingName}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="form-group">
                    <Button color="primary" type="submit" size="md" onClick={() => onSubmit()}>
                        {loading ? <Spinner size="sm" /> : 'SIMPAN'}
                    </Button>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default Form;
