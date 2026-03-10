import React, { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalHeader, Spinner } from "reactstrap";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Icon, Row, RSelect } from "@/components";
import { store as storeProduct, update as updateProduct } from "@/common/api/master/product";
import { get as getProgram } from "@/common/api/institution/program";
import { get as getBoarding } from "@/common/api/master/boarding";
import type { OptionsType, ProductType } from "@/types";
import { GENDER_OPTIONS } from "@/common/constants";
import { useYearContext } from "@/common/hooks/useYearContext";
import { useInstitutionContext } from "@/common/hooks/useInstitutionContext";
import { formatCurrency, formatNumber } from "@/helpers";

interface PartialProps {
    modal: boolean;
    setModal: (modal: boolean) => void;
    product: ProductType
    setProduct: (product: ProductType) => void;
    setLoadData: (loadData: boolean) => void;
}

const Partial = ({ modal, setModal, product, setProduct, setLoadData }: PartialProps) => {
    const year = useYearContext()
    const institution = useInstitutionContext()
    const [loading, setLoading] = useState(false);
    const [programOptions, setProgramOptions] = useState<OptionsType[]>()
    const [boardingProgramOptions, setBoardingProgramOptions] = useState<OptionsType[]>()
    const { control, reset, handleSubmit, register, formState: { errors }, setValue } = useForm<ProductType>();
    const genderOptions: OptionsType[] = [
        { value: 0, label: "Semua" },
        ...GENDER_OPTIONS
    ]
    const boardingOptions: OptionsType[] = [
        { value: 1, label: "Ya" },
        { value: 2, label: "Tidak" },
    ]
    const onSubmit = (values: ProductType) => {
        const formData: ProductType = {
            ...values,
            price: formatNumber(String(values.price)),
        }
        if (product?.id === undefined) onStore(formData)
        else onUpdate(formData);
    }
    const onStore = async (value: ProductType) => {
        setLoading(true);
        await storeProduct(value).then((resp) => {
            if (resp.status === 'success') {
                toggle()
                setLoadData(true)
            }
        }).finally(() => setLoading(false));
    }
    const onUpdate = async (value: ProductType) => {
        setLoading(true)
        await updateProduct(value).then((resp) => {
            if (resp.status === 'success') {
                toggle()
                setLoadData(true)
            }
        }).finally(() => setLoading(false));
    }
    const handleReset = () => {
        setProduct({
            id: undefined,
            name: '',
            surname: '',
            price: null,
            gender: null,
            programId: null,
            boardingId: null,
            isBoarding: null,
        });
        reset();
    }
    const toggle = () => {
        setModal(false);
        handleReset();
    };
    const price = useWatch({ control, name: 'price' })
    const isBoarding = useWatch({ control, name: 'isBoarding' })

    useEffect(() => {
        setValue('id', product.id);
        setValue('yearId', year?.id ? year.id : 0)
        setValue('institutionId', institution?.id ? institution.id : 0)
        setValue('name', product.name);
        setValue('surname', product.surname)
        setValue('price', product.price)
        setValue('gender', product.gender)
        setValue('programId', product.programId)
        setValue('isBoarding', product.isBoarding)
        setValue('boardingId', product.boardingId)
    }, [product, setValue]);

    useEffect(() => {
        getProgram<OptionsType>({ yearId: year?.id, institutionId: institution?.id, type: 'select' })
            .then((resp) => {
                if (resp.length > 0) {
                    setProgramOptions([
                        { value: 0, label: 'Semua' },
                        ...resp
                    ]);
                }
            })
        getBoarding<OptionsType>({ type: 'select' }).then((resp) => {
            if (resp.length > 0) {
                setBoardingProgramOptions([
                    { value: 0, label: 'Semua' },
                    ...resp
                ]);
            }
        })
    }, []);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross" />
                </button>
            }>
                {product?.id === undefined ? 'TAMBAH' : 'UBAH'}
            </ModalHeader>
            <ModalBody>
                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                    <Row className="gy-0">
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="name">Nama Item</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder="Ex. Seragam Madrasah"
                                    {...register("name", { required: true })}
                                />
                                {errors.name && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="surname">Alias</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="surname"
                                    placeholder="Ex. SRGM"
                                    {...register("surname", { required: true })}
                                />
                                {errors.surname && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="price">Harga</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="price"
                                    placeholder="Ex. 1.000.000"
                                    value={formatCurrency(price)}
                                    {...register("price", { required: true })}
                                />
                                {errors.price && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="gender">Jenis Kelamin</label>
                            <div className="form-control-wrap">
                                <Controller
                                    control={control}
                                    name="gender"
                                    rules={{ required: false }}
                                    render={({ field: { value, onChange } }) => (
                                        <React.Fragment>
                                            <RSelect
                                                options={genderOptions}
                                                value={genderOptions.find((item) => item.value === value)}
                                                onChange={(val) => onChange(val?.value)}
                                                placeholder="Pilih Kelamin"
                                            />
                                        </React.Fragment>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="programId">Program Madrasah</label>
                            <div className="form-control-wrap">
                                <Controller
                                    control={control}
                                    name="programId"
                                    rules={{ required: false }}
                                    render={({ field: { value, onChange } }) => (
                                        <React.Fragment>
                                            <RSelect
                                                options={programOptions}
                                                value={programOptions?.find((item) => item.value === value)}
                                                onChange={(val) => onChange(val?.value)}
                                                placeholder="Pilih Program"
                                            />
                                        </React.Fragment>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="isBoarding">Boarding</label>
                            <div className="form-control-wrap">
                                <Controller
                                    control={control}
                                    name="isBoarding"
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <React.Fragment>
                                            <RSelect
                                                options={boardingOptions}
                                                value={boardingOptions?.find((item) => item.value === value)}
                                                onChange={(val) => onChange(val?.value)}
                                                placeholder="Pilih Boarding"
                                            />
                                        </React.Fragment>
                                    )}
                                />
                            </div>
                        </div>
                        {isBoarding === 1 && (
                            <div className="form-group">
                                <label className="form-label" htmlFor="boardingId">Program Boarding</label>
                                <div className="form-control-wrap">
                                    <Controller
                                        control={control}
                                        name="boardingId"
                                        rules={{ required: false }}
                                        render={({ field: { value, onChange } }) => (
                                            <React.Fragment>
                                                <RSelect
                                                    options={boardingProgramOptions}
                                                    value={boardingProgramOptions?.find((item) => item.value === value)}
                                                    onChange={(val) => onChange(val?.value)}
                                                    placeholder="Pilih Boarding"
                                                />
                                            </React.Fragment>
                                        )}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="form-group">
                            <Button color="primary" type="submit" size="md">
                                {loading ? <Spinner size="sm" /> : 'SIMPAN'}
                            </Button>
                        </div>
                    </Row>
                </form>
            </ModalBody>
        </Modal>
    )
}

export default Partial;
