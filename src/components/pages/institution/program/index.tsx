import {
    Button,
    Icon,
    ReactDataTable, RSelect
} from "@/components";
import React, { useEffect, useState } from "react";
import type { ColumnType, InstitutionProgramFormType, InstitutionProgramType, OptionsType } from "@/types";
import { Badge, ButtonGroup, Modal, ModalBody, ModalHeader, Spinner } from "reactstrap";
import {
    get as getProgram,
    destroy as destroyProgram,
    store as storeProgram,
    update as updateProgram
} from "@/common/api/institution/program";
import { useYearContext } from "@/common/hooks/useYearContext";
import { getRandomColor } from "@/helpers";
import { Controller, useForm } from "react-hook-form";
import { get as getBoarding } from "@/common/api/master/boarding";

interface ProgramComponentProps {
    institutionId?: number;
    modal: boolean;
    setModal: (modal: boolean) => void;
}
const ProgramComponent = ({ institutionId, modal, setModal }: ProgramComponentProps) => {
    const year = useYearContext()
    const [loading, setLoading] = useState<boolean | number | string | undefined>(false)
    const [loadData, setLoadData] = useState<boolean>(true)
    const [programs, setPrograms] = useState<InstitutionProgramType[]>([])
    const [boardingOptions, setBoardingOptions] = useState<OptionsType[]>()
    const {
        control,
        reset,
        handleSubmit,
        register,
        formState: { errors },
        setValue,
        getValues
    } = useForm<InstitutionProgramFormType>();
    const Column: ColumnType<InstitutionProgramType>[] = [
        {
            name: "Nama Program",
            selector: (row) => row.name,
            sortable: false,
        },
        {
            name: "Singkatan",
            selector: (row) => row.alias,
            sortable: false,
        },
        {
            name: "Boarding",
            selector: (row) => row.boarding,
            sortable: false,
            cell: (row) => {
                const boarding: OptionsType[] = row?.boarding !== '' ? JSON.parse(row.boarding) : []
                return <div>
                    {boarding.map((item) => (
                        <Badge key={item.value} pill color={getRandomColor(item.value)} className="me-1">{item.label}</Badge>
                    ))}
                </div>
            }
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
                        setValue('alias', row.alias);
                        setValue('description', row.description);
                        setValue('boarding', row?.boarding !== '' ? JSON.parse(row.boarding) : []);
                        setModal(true);
                    }}>
                        <Icon name="pen" />
                    </Button>
                    <Button outline color="danger" onClick={async () => {
                        setLoading(row?.id);
                        await destroyProgram(row?.id)
                            .then(() => setLoadData(true))
                            .finally(() => setLoading(false));
                    }}>
                        {loading === row.id ? <Spinner size="sm" /> : <Icon name="trash" />}
                    </Button>
                </ButtonGroup>
            ),
        },
    ];
    const toggle = () => {
        setModal(false);
        reset();
    };
    const onSubmit = (value: InstitutionProgramFormType) => {
        const formData: InstitutionProgramType = {
            id: value.id,
            yearId: year?.id,
            institutionId: institutionId,
            name: value.name,
            alias: value.alias,
            description: value.description,
            boarding: JSON.stringify(value.boarding),
        }
        if (value.id === undefined) onStore(formData)
        else onUpdate(formData);
    }
    const onStore = async (formData: InstitutionProgramType) => {
        setLoading(true);
        await storeProgram(formData).then((resp) => {
            if (resp) {
                toggle()
                setLoadData(true)
            } else {
                return
            }
        }).finally(() => setLoading(false));
    }
    const onUpdate = async (formData: InstitutionProgramType) => {
        setLoading(true)
        await updateProgram(formData).then((resp) => {
            if (resp) {
                toggle()
                setLoadData(true)
            } else {
                return
            }
        }).finally(() => setLoading(false));
    }

    useEffect(() => {
        getBoarding<OptionsType>({ type: 'select' }).then((resp) => {
            if (resp) setBoardingOptions(resp)
        })
    }, []);

    useEffect(() => {
        getProgram<InstitutionProgramType>({ list: 'table', yearId: year?.id, institutionId: institutionId }).then((resp) => {
            if (resp) setPrograms(resp)
        }).finally(() => setLoadData(false))
    }, [institutionId, year, loadData]);

    return (
        <React.Fragment>
            <ReactDataTable data={programs} columns={Column} pagination progressPending={loadData} />
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle} close={
                    <button className="close" onClick={toggle}>
                        <Icon name="cross" />
                    </button>
                }>
                    {getValues('id') === undefined ? 'TAMBAH' : 'UBAH'}
                </ModalHeader>
                <ModalBody>
                    <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="name">Nama Program</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder="Ex. Unggulan Tahfidz"
                                    {...register("name", { required: 'Kolom tidak boleh kosong' })}
                                />
                                {errors.name && <span className="invalid">{errors.name.message}</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="alias">Alias</label>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="alias"
                                    placeholder="Ex. TFZ"
                                    {...register("alias", { required: 'Kolom tidak boleh kosong' })}
                                />
                                {errors.alias && <span className="invalid">{errors.alias.message}</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="description">Diskripsi</label>
                            <div className="form-control-wrap">
                                <textarea
                                    className="form-control"
                                    id="description"
                                    placeholder="Ex. Program Unggulan Tahfidz"
                                    {...register("description", { required: false })}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="boarding">Pilih Boarding</label>
                            <div className="form-control-wrap">
                                <Controller
                                    control={control}
                                    name="boarding"
                                    rules={{ required: "Boarding tidak boleh kosong" }}
                                    render={({ field }) => (
                                        <React.Fragment>
                                            <RSelect
                                                options={boardingOptions}
                                                value={field.value}
                                                onChange={(selectedOption) => field.onChange(selectedOption)}
                                                placeholder="Pilih Boarding"
                                                isMulti
                                            />
                                            <input type="hidden" id="boarding" className="form-control" />
                                            {errors.boarding && <span className="invalid">Kolom tidak boleh kosong.</span>}
                                        </React.Fragment>
                                    )
                                    } />
                            </div>
                        </div>
                        <div className="form-group">
                            <Button color="primary" type="submit" size="md">
                                {loading ? <Spinner size="sm" /> : 'SIMPAN'}
                            </Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </React.Fragment>
    )
}

export default ProgramComponent