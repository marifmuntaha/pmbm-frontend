import React, {useEffect, useState} from "react";
import { printReceipt } from "./printReceipt";
import {Button, Modal, ModalBody, ModalHeader, Row, Spinner} from "reactstrap";
import {Controller, useForm} from "react-hook-form";
import {Icon, RSelect} from "@/components";
import { store as storeTransaction } from "@/common/api/payment/transaction";
import { get as getAccount } from "@/common/api/institution/account"
import type {OptionsType, TransactionType} from "@/types";
import {useYearContext} from "@/common/hooks/useYearContext";
import {useAuthContext} from "@/common/hooks/useAuthContext";
import {useInstitutionContext} from "@/common/hooks/useInstitutionContext";

interface PartialProps {
    modal: boolean;
    setModal: (modal: boolean) => void;
    setLoadData: (loadData: boolean) => void;
}

interface TransactionFormType extends TransactionType {
    type: number|undefined,
    amount: number,
    recipientName?: string,
}



const Partial = ({modal, setModal, setLoadData}: PartialProps) => {
    const year = useYearContext();
    const { user } = useAuthContext();
    const institution = useInstitutionContext();
    const [loading, setLoading] = useState(false);
    const [printAfterSave, setPrintAfterSave] = useState(false);
    const [accountOptions, setAccountOptions] = useState<OptionsType[]>()
    const {
        control,
        reset,
        handleSubmit,
        register,
        formState: {errors},
    } = useForm<TransactionFormType>();

    const typeOptions: OptionsType[] = [
        {value: 1, label: 'Transaksi Masuk'},
        {value: 2, label: 'Transaksi Keluar'}
    ]

    const onSubmit = async (values: TransactionFormType) => {
        const formData: TransactionType = {
            id: values?.id,
            yearId: year?.id,
            institutionId: user?.institutionId,
            accountId: values.accountId,
            name: values?.name,
            credit: values.type === 2 ? values.amount : 0,
            debit: values.type === 1 ? values.amount : 0
        }
        setLoading(true);
        await storeTransaction(formData).then((resp) => {
            if (resp.status === 'success') {
                if (printAfterSave) {
                    const selectedAccount = accountOptions?.find(a => a.value === values.accountId);
                    printReceipt({
                        name: values.name || '',
                        amount: values.amount,
                        type: values.type ?? 1,
                        accountLabel: selectedAccount?.label?.toString() ?? '',
                        treasurerName: user?.name ?? 'Bendahara',
                        institutionName: institution?.surname ?? user?.institution?.name ?? '',
                        recipientName: values.recipientName ?? '',
                        yearName: year?.name ?? '',
                        logoUrl: institution?.logo ?? undefined,
                    });
                }
                toggle();
                reset();
                setLoadData(true);
            }
        }).finally(() => setLoading(false));
    }

    const toggle = () => {
        setModal(false);
        reset();
    };

    useEffect(() => {
        const fetchData = () => {
            getAccount<OptionsType>({type: 'select', institutionId: user?.institutionId}).then((resp) => setAccountOptions(resp));
        }
        fetchData();
    }, [])

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross"/>
                </button>
            }>
                TAMBAH TRANSAKSI
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <Row className="gy-0">
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="name">Jenis Transaksi</label>
                            <Controller
                                control={control}
                                name="type"
                                rules={{required: true}}
                                render={({field: {value, onChange}}) => (
                                    <React.Fragment>
                                        <div className="form-control-warp">
                                            <RSelect
                                                options={typeOptions}
                                                value={typeOptions.find((item) => item.value === value)}
                                                onChange={(val) => onChange(val?.value)}
                                                placeholder="Pilih Jenis"
                                            />
                                            {errors.type && <span className="invalid">Kolom tidak boleh kosong</span>}
                                        </div>
                                    </React.Fragment>
                                )}
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="accountId">Rekening</label>
                            <Controller
                                control={control}
                                name="accountId"
                                rules={{required: true}}
                                render={({field: {value, onChange}}) => (
                                    <React.Fragment>
                                        <div className="form-control-warp">
                                            <RSelect
                                                options={accountOptions}
                                                value={accountOptions?.find((item) => item.value === value)}
                                                onChange={(val) => onChange(val?.value)}
                                                placeholder="Pilih Rekening"
                                            />
                                            {errors.accountId && <span className="invalid">Kolom tidak boleh kosong</span>}
                                        </div>
                                    </React.Fragment>
                                )}
                            />
                        </div>
                    </Row>
                    <div className="form-group">
                        <label className="form-label" htmlFor="description">Keterangan</label>
                        <div className="form-control-wrap">
                            <textarea
                                className="form-control"
                                id="name"
                                placeholder="Ex. Setor Kepelopor"
                                {...register("name", {required: false})}
                            />
                            {errors.name && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="amount">Jumlah</label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                className="form-control"
                                id="amount"
                                placeholder="Ex. 1000000"
                                {...register("amount", {required: true})}
                            />
                            {errors.amount && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="recipientName">
                            Nama Penerima <span className="text-muted small">(untuk cetak)</span>
                        </label>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                className="form-control"
                                id="recipientName"
                                placeholder="Nama penerima transaksi"
                                {...register("recipientName")}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Button
                            className="me-3"
                            color="primary"
                            type="submit"
                            size="sm"
                            onClick={() => setPrintAfterSave(false)}
                            disabled={loading}
                        >
                            {loading && !printAfterSave ? <Spinner size="sm" className="me-1"/> : <Icon name="save" className="me-1"/>}
                            Simpan
                        </Button>
                        <Button
                            color="success"
                            type="submit"
                            size="sm"
                            onClick={() => setPrintAfterSave(true)}
                            disabled={loading}
                        >
                            {loading && printAfterSave ? <Spinner size="sm" className="me-1"/> : <Icon name="printer" className="me-1"/>}
                            Simpan &amp; Cetak
                        </Button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    )
}

export default Partial;
