import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {Icon, RSelect} from "@/components";
import React, {useCallback, useEffect, useState} from "react";
import {Controller, useForm, useWatch} from "react-hook-form";
import {get as getStudent} from "@/common/api/student/personal";
import {get as getItem} from "@/common/api/master/product";
import {store as storeInvoiceDetail} from "@/common/api/invoiceDetail";
import {show as showInvoice, update as updateInvoice} from "@/common/api/invoice";
import type {InvoiceDetailType, InvoiceType, OptionsType} from "@/types";
import {useYearContext} from "@/common/hooks/useYearContext";
import {useAuthContext} from "@/common/hooks/useAuthContext";
import {formatCurrency} from "@/helpers";

interface AddProps {
    isOpen: boolean;
    toggle: () => void;
    setLoadData: (loadData: boolean) => void;
}

const Add = ({isOpen, toggle}: AddProps) => {
    const year = useYearContext();
    const {user} = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [studentOptions, setStudentOptions] = useState<OptionsType[]>();
    const [studentSelected, setStudentSelected] = useState<OptionsType>()
    const [itemOptions, setItemOptions] = useState<OptionsType[]>();
    const [itemSelected, setItemSelected] = useState<OptionsType>()
    const {control, formState: {errors}, handleSubmit, register, reset} = useForm<InvoiceDetailType>();
    const discount = useWatch({control, name: 'discount'})
    const onSubmit = async (values: InvoiceDetailType) => {
        setLoading(true);
        const invoiceDetailData: InvoiceDetailType = {
            invoiceId: studentSelected?.data.invoice.id,
            productId: itemSelected?.value,
            name: itemSelected?.data.item.name,
            price: itemSelected?.data.item.price,
            discount: values.discount,
            amount: itemSelected?.data.item.price - values.discount,
        }
        const resp = await storeInvoiceDetail(invoiceDetailData)
        if (resp?.status === "success" && resp.result) {
            const invoice = await showInvoice({id: studentSelected?.data.invoice.id})
            if (invoice) {
                const invoiceData: InvoiceType = {
                    ...invoice,
                    amount: Number(invoice.amount) + Number(resp.result.amount),
                    status: invoice.status === "PAID" ? "PENDING" : invoice.status,
                }
                const update = await updateInvoice(invoiceData)
                if (update?.status === "success") {
                    toggle()
                    reset()
                    setLoading(true)
                }
            }

        }
        setLoading(false);
    }

    const handleAmount = useCallback(() : string => {
        const amount = itemSelected?.data.item.price - discount
        return formatCurrency(studentSelected?.data.invoice.amount) + " => " + formatCurrency(studentSelected?.data.invoice.amount + amount)
    }, [studentSelected, itemSelected, discount])

    useEffect(() => {
        const fetchData = async () => {
            if (isOpen) {
                const studentData = await getStudent<OptionsType>({
                    type: 'select',
                    yearId: year?.id,
                    institutionId: user?.institutionId
                })
                const itemData = await getItem<OptionsType>({
                    type: 'select',
                    yearId: year?.id,
                    institutionId: user?.institutionId
                })
                setStudentOptions(studentData)
                setItemOptions(itemData)
            }
        }
        fetchData();
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} toggle={toggle} size="md">
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross"/>
                </button>
            }>
                Tambah Tagihan
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="invoiceId">Pilih Siswa</label>
                        <div className="form-control-wrap">
                            <Controller
                                control={control}
                                name="invoiceId"
                                rules={{required: "Status tahun tidak boleh kosong"}}
                                render={({field: {value, onChange}}) => (
                                    <React.Fragment>
                                        <RSelect
                                            options={studentOptions}
                                            value={studentOptions?.find((item) => item.value === value)}
                                            onChange={(opt) => {
                                                onChange(opt?.value)
                                                setStudentSelected(opt ?? undefined)
                                            }}
                                            placeholder="Pilih Siswa"
                                        />
                                        <input type="hidden" id="active" className="form-control"/>
                                        {errors.invoiceId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                                    </React.Fragment>
                                )}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="item">Pilih Item</label>
                        <div className="form-control-wrap">
                            <Controller
                                control={control}
                                name="productId"
                                rules={{required: "Status tahun tidak boleh kosong"}}
                                render={({field: {value, onChange}}) => (
                                    <React.Fragment>
                                        <RSelect
                                            options={itemOptions}
                                            value={itemOptions?.find((item) => item.value === value)}
                                            onChange={(opt) => {
                                                onChange(opt?.value)
                                                setItemSelected(opt ?? undefined)
                                            }}
                                            placeholder="Pilih Item"
                                        />
                                        <input type="hidden" id="active" className="form-control"/>
                                        {errors.productId && <span className="invalid">Kolom tidak boleh kosong.</span>}
                                    </React.Fragment>
                                )}
                            />
                        </div>
                    </div>
                    {itemSelected && (
                        <div className="form-group">
                            <label className="form-label" htmlFor="discount">Potongan</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="discount"
                                    placeholder="Ex. 25.0000"
                                    defaultValue={0}
                                    {...register("discount", { required: true })}
                                />
                                {errors.discount && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                    )}
                    {studentSelected && (
                        <div className="table-responsive">
                            <table className="table border">
                                <tbody>
                                <tr>
                                    <td>Nama</td>
                                    <td>:</td>
                                    <td>{studentSelected.data.student.name}</td>
                                </tr>
                                <tr>
                                    <td>Nomor Pendaftaran</td>
                                    <td>:</td>
                                    <td>{studentSelected.data.student.number}</td>
                                </tr>
                                <tr>
                                    <td>Jumlah Tagihan</td>
                                    <td>:</td>
                                    <td>{handleAmount()}</td>
                                </tr>
                                <tr>
                                    <td>Status Tagihan</td>
                                    <td>:</td>
                                    <td>{studentSelected.data.invoice.status}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="form-group">
                        <Button color="primary" type="submit" size="md">
                            {loading ? <Spinner size="sm" /> : 'SIMPAN'}
                        </Button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    )
}

export default Add;