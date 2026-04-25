import React, {useEffect, useState} from "react";
import {Button, Icon, ReactDataTable, RSelect} from "@/components";
import type {ColumnType, InstitutionAccountType, OptionsType} from "@/types";
import {Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {
    get as getAccount,
    store as storeAccount,
} from "@/common/api/institution/account";
import {Controller, useForm} from "react-hook-form";

interface AccountComponentProps {
    institutionId?: number;
    modal: boolean;
    setModal: (modal: boolean) => void;
}
const AccountComponent = ({institutionId, modal, setModal}: AccountComponentProps) => {
    const [loading, setLoading] = useState<boolean|number|undefined>(false);
    const [loadData, setLoadData] = useState<boolean>()
    const [accounts, setAccounts] = useState<InstitutionAccountType[]>([])
    const {
        control,
        reset,
        handleSubmit,
        register,
        formState: {errors},
    } = useForm<InstitutionAccountType>();
    const methodOptions: OptionsType[] = [
        {value: 1, label: "Tunai"},
        {value: 2, label: "Non Tunai"}
    ]
    const Column: ColumnType<InstitutionAccountType>[] = [
        {
            name: "Nama Akun",
            selector: (row) => row.name,
            sortable: false,
        },
        {
            name: "metode",
            selector: (row) => row.method === 1 ? "Tunai" : "Non Tunai",
            sortable: false,
        },
    ];
    const toggle = () => {
        setModal(false);
        reset();
    };
    const onSubmit = async (values: InstitutionAccountType) => {
        setLoading(true);
        const formData: InstitutionAccountType = {
            id: values.id,
            institutionId: institutionId,
            name: values.name,
            method: values.method,
        }
        await storeAccount(formData).then((resp) => {
            if (resp) {
                toggle()
                setLoadData(true)
            } else {
                return
            }
        }).finally(() => setLoading(false));
    }
    useEffect(() => {
        getAccount<InstitutionAccountType>({ list: 'table', institutionId: institutionId }).then((resp) => {
            if (resp) setAccounts(resp)
        }).finally(() => setLoadData(false))
    }, [institutionId, loadData]);

    return (
        <React.Fragment>
            <ReactDataTable data={accounts} columns={Column} pagination progressPending={loadData} />
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
                            <label className="form-label" htmlFor="name">Nama Rekening</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder="Ex. TUNAI MA"
                                    {...register("name", {required: true})}
                                />
                                {errors.name && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="method">Pilih Jenis</label>
                            <div className="form-control-wrap">
                                <Controller
                                    control={control}
                                    name="method"
                                    rules={{ required: "Jenis tidak boleh kosong" }}
                                    render={({ field: {value, onChange} }) => (
                                        <React.Fragment>
                                            <RSelect
                                                options={methodOptions}
                                                value={methodOptions.find((item) => item.value === value)}
                                                onChange={(opt) => onChange(opt?.value)}
                                                placeholder="Pilih Jenis"
                                            />
                                            <input type="hidden" id="boarding" className="form-control" />
                                            {errors.method && <span className="invalid">Kolom tidak boleh kosong.</span>}
                                        </React.Fragment>
                                    )
                                    } />
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
        </React.Fragment>
    )
}

export default AccountComponent