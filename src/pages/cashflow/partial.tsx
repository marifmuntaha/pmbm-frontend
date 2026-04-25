import React, {useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {Controller, useForm} from "react-hook-form";
import {Icon, RSelect} from "@/components";
import { store as storeTransaction } from "@/common/api/institution/transaction";
import type {OptionsType, TransactionType} from "@/types";
import {useYearContext} from "@/common/hooks/useYearContext";
import {useAuthContext} from "@/common/hooks/useAuthContext";

interface PartialProps {
    modal: boolean;
    setModal: (modal: boolean) => void;
    setLoadData: (loadData: boolean) => void;
}

interface TransactionFormType extends TransactionType {
    type: number|undefined,
    amount: number,
}
const Partial = ({modal, setModal, setLoadData}: PartialProps) => {
    const year = useYearContext();
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(false);
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
            name: values?.name,
            credit: values.type === 2 ? values.amount : 0,
            debit: values.type === 1 ? values.amount : 0
        }
        setLoading(true);
        await storeTransaction(formData).then((resp) => {
            if (resp.status === 'success') {
                toggle()
                reset()
                setLoadData(true)
            }
        }).finally(() => setLoading(false));
    }

    const toggle = () => {
        setModal(false);
        reset()
    };

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross"/>
                </button>
            }>
                TAMBAH
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
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
                                placeholder="Ex. TFZ"
                                {...register("amount", {required: true})}
                            />
                            {errors.amount && <span className="invalid">Kolom tidak boleh kosong</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <Button color="primary" type="submit" size="md">
                            {loading ? <Spinner size="sm"/> : 'SIMPAN'}
                        </Button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    )
}

export default Partial;
