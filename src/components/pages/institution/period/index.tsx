import {
    Button,
    Icon,
    ReactDataTable, Row
} from "@/components";
import React, {useEffect, useState} from "react";
import type {ColumnType, InstitutionPeriodFormType, InstitutionPeriodType} from "@/types";
import {ButtonGroup, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {
    get as getPeriod,
    destroy as destroyPeriod,
    store as storePeriod,
    update as updatePeriod
} from "@/common/api/institution/period";
import {useYearContext} from "@/common/hooks/useYearContext";
import moment from "moment/moment";
import "moment/locale/id"
import {Controller, useForm} from "react-hook-form";
import DatePicker from "react-datepicker";

interface PeriodComponentProps {
    institutionId?: number;
    modal: boolean;
    setModal: (modal: boolean) => void;
}

const PeriodComponent = ({institutionId, modal, setModal} : PeriodComponentProps) => {
    const year = useYearContext()
    const [loading, setLoading] = useState<boolean | number | string | undefined>(false)
    const [loadData, setLoadData] = useState<boolean>(true)
    const [periods, setPeriods] = useState<InstitutionPeriodType[]>([])
    const {
        control,
        reset,
        handleSubmit,
        register,
        formState: {errors},
        setValue,
        getValues
    } = useForm<InstitutionPeriodFormType>();
    const Column: ColumnType<InstitutionPeriodType>[] = [
        {
            name: "Nama Program",
            selector: (row) => row.name,
            sortable: false,
        },
        {
            name: "Diskripsi",
            selector: (row) => row.description,
            sortable: false,
        },
        {
            name: "Mulai",
            selector: (row) => moment(row?.start).locale('id').format('DD MMMM YYYY'),
            sortable: false,
        },
        {
            name: "Selesai",
            selector: (row) => moment(row?.end).locale('id').format('DD MMMM YYYY'),
            sortable: false,
        },
        {
            name: "Aksi",
            selector: (row) => row?.id,
            sortable: false,
            width: "150px",
            cell: (row) => (
                <ButtonGroup size="sm">
                    <Button outline color="warning" onClick={() => {
                        setValue('id', row.id);
                        setValue('yearId', row.yearId);
                        setValue('institutionId', row.institutionId);
                        setValue('name', row.name);
                        setValue('description', row.description);
                        setValue('start', row.start !== '' ? moment(row.start).toDate() : new Date())
                        setValue('end', row.end !== '' ? moment(row.end).toDate() : new Date())
                        setModal(true);
                    }}>
                        <Icon name="pen"/>
                    </Button>
                    <Button outline color="danger" onClick={async () => {
                        setLoading(row?.id);
                        await destroyPeriod(row?.id)
                            .then(() => setLoadData(true))
                            .finally(() => setLoading(false));
                    }}>
                        {loading === row.id ? <Spinner size="sm"/> : <Icon name="trash"/>}
                    </Button>
                </ButtonGroup>
            ),
        },
    ];
    const onSubmit = (value: InstitutionPeriodFormType) => {
        const formData: InstitutionPeriodType = {
            id: value.id,
            yearId: year?.id,
            institutionId: institutionId,
            name: value.name,
            description: value.description,
            start: moment(value.start).format('YYYY-MM-DD'),
            end: moment(value.end).format('YYYY-MM-DD'),
        }
        if (value.id === undefined) onStore(formData)
        else onUpdate(formData);
    }
    const onStore = async (formData: InstitutionPeriodType) => {
        setLoading(true);
        await storePeriod(formData).then((resp) => {
            if (resp) {
                toggle()
                setLoadData(true)
            } else {
                return
            }
        }).finally(() => setLoading(false));
    }
    const onUpdate = async (formData: InstitutionPeriodType) => {
        setLoading(true)
        await updatePeriod(formData).then((resp) => {
            if (resp) {
                toggle()
                setLoadData(true)
            } else {
                return
            }
        }).finally(() => setLoading(false));
    }
    const toggle = () => {
        setModal(false);
        reset();
    };

    useEffect(() => {
        getPeriod<InstitutionPeriodType>({list: 'table', yearId: year?.id, institutionId: institutionId}).then((resp) => {
            if (resp) setPeriods(resp)
        }).finally(() => setLoadData(false))
    }, [institutionId, year, loadData]);

    return (
        <React.Fragment>
            <ReactDataTable data={periods} columns={Column} pagination progressPending={loadData}/>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle} close={
                    <button className="close" onClick={toggle}>
                        <Icon name="cross"/>
                    </button>
                }>
                    {getValues('id') === undefined ? 'TAMBAH' : 'UBAH'}
                </ModalHeader>
                <ModalBody>
                    <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                        <Row className="gy-0">
                            <div className="form-group">
                                <label className="form-label" htmlFor="name">Nama Periode</label>
                                <div className="form-control-wrap">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        placeholder="Ex. Gelombang 1"
                                        {...register("name", {required: 'Kolom tidak boleh kosong'})}
                                    />
                                    {errors.name && <span className="invalid">{errors.name.message}</span>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="description">Diskripsi</label>
                                <div className="form-control-wrap">
                            <textarea
                                className="form-control"
                                id="description"
                                placeholder="Ex. Periode Gelombang 1"
                                {...register("description", {required: false})}
                            />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <label className="form-label" htmlFor="start">Tanggal Mulai</label>
                                <div className="form-control-wrap">
                                    <Controller
                                        control={control}
                                        name="start"
                                        rules={{required: 'Kolom tidak boleh Kosong'}}
                                        render={({field}) => (
                                            <React.Fragment>
                                                <DatePicker
                                                    locale="id"
                                                    selected={field.value}
                                                    onChange={(e) => {
                                                        field.onChange(e)
                                                    }}
                                                    dateFormat={"dd/MM/yyyy"}
                                                    className="form-control date-picker"
                                                />
                                                <input type="hidden" className="form-control" id="start"/>
                                                {errors.start && <span className="invalid">{errors.start.message}</span>}
                                            </React.Fragment>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <label className="form-label" htmlFor="end">Tanggal Selesai</label>
                                <div className="form-control-wrap">
                                    <Controller
                                        control={control}
                                        name="end"
                                        rules={{required: 'Kolom tidak boleh Kosong'}}
                                        render={({field}) => (
                                            <React.Fragment>
                                                <DatePicker
                                                    locale="id"
                                                    selected={field.value}
                                                    onChange={(e) => {
                                                        field.onChange(e)
                                                    }}
                                                    dateFormat={"dd/MM/yyyy"}
                                                    className="form-control date-picker"
                                                />
                                                <input type="hidden" className="form-control" id="end"/>
                                                {errors.end && <span className="invalid">{errors.end.message}</span>}
                                            </React.Fragment>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <Button color="primary" type="submit" size="md">
                                    {loading ? <Spinner size="sm"/> : 'SIMPAN'}
                                </Button>
                            </div>
                        </Row>
                    </form>
                </ModalBody>
            </Modal>
        </React.Fragment>
    )
}

export default PeriodComponent;