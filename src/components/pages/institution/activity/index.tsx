import React, {useEffect, useState} from "react";
import {Button, Icon, ReactDataTable} from "@/components";
import type {ColumnType, InstitutionActivityFormType, InstitutionActivityType} from "@/types";
import {Link} from "react-router-dom";
import {ButtonGroup, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {
    destroy as destroyActivity,
    get as getActivity,
    store as storeActivity, update as updateActivity
} from "@/common/api/institution/activity";
import {useYearContext} from "@/common/hooks/useYearContext";
import {useForm} from "react-hook-form";

interface ActivitiesComponentProps {
    institutionId?: number;
    modal: boolean;
    setModal: (modal: boolean) => void;
}
const ActivityComponent = ({institutionId, modal, setModal}: ActivitiesComponentProps) => {
    const year = useYearContext();
    const [loading, setLoading] = useState<boolean|number|undefined>(false);
    const [loadData, setLoadData] = useState<boolean>()
    const [activities, setActivities] = useState<InstitutionActivityType[]>([])
    const {
        reset,
        handleSubmit,
        register,
        formState: {errors},
        setValue,
        getValues,
    } = useForm<InstitutionActivityFormType>();

    const Column: ColumnType<InstitutionActivityType>[] = [
        {
            name: "Tahun Pelajaran",
            selector: (row) => row.year?.name,
            sortable: false,
        },
        {
            name: "Kapasitas",
            selector: (row) => row.capacity + ' Siswa',
            sortable: false,
        },
        {
            name: "Brosur",
            selector: (row) => row.brochure,
            sortable: false,
            cell: (row) => (
                <Link to={String(row.brochure)}>
                    <Button outline color="info" size="sm">
                        <Icon name="eye" />
                    </Button>
                </Link>
            ),
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
                        setValue('capacity', row.capacity);
                        setModal(true);
                    }}>
                        <Icon name="pen" />
                    </Button>
                    <Button outline color="danger" onClick={async () => {
                        setLoading(row?.id);
                        await destroyActivity(row?.id)
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
    const onSubmit = (value: InstitutionActivityFormType) => {
        const formData: InstitutionActivityType = {
            id: value.id,
            yearId: year?.id,
            institutionId: institutionId,
            capacity: value.capacity,
            file: value.file[0]
        }
        if (value.id === undefined) onStore(formData)
        else onUpdate(formData);
    }
    const onStore = async (formData: InstitutionActivityType) => {
        setLoading(true);
        await storeActivity(formData).then((resp) => {
            if (resp) {
                toggle()
                setLoadData(true)
            } else {
                return
            }
        }).finally(() => setLoading(false));
    }
    const onUpdate = async (formData: InstitutionActivityType) => {
        setLoading(true)
        await updateActivity(formData).then((resp) => {
            if (resp) {
                toggle()
                setLoadData(true)
            } else {
                return
            }
        }).finally(() => setLoading(false));
    }

    useEffect(() => {
        getActivity({ list: 'table', institutionId: institutionId }).then((resp) => {
            if (resp) setActivities(resp)
        }).finally(() => setLoadData(false))
    }, [institutionId, loadData]);

    return (
        <React.Fragment>
            <ReactDataTable data={activities} columns={Column} pagination progressPending={loadData} />
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
                        <div className="form-group">
                            <label className="form-label" htmlFor="capacity">Kapasitas</label>
                            <div className="form-control-wrap">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="capacity"
                                        placeholder="Ex. 180"
                                        {...register("capacity", {required: true})}
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text">Siswa</span>
                                    </div>
                                </div>
                                {errors.capacity && <span className="invalid">Kolom tidak boleh kosong</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="file">File Brosur</label>
                            <div className="form-control-wrap">
                                <input
                                    type="file"
                                    id="file"
                                    className="form-control"
                                    {...register("file", {
                                        required: "Berkas tidak boleh kosong",
                                        validate: {
                                            isPdf: (files) => {
                                                return (
                                                    files[0]?.type === "application/pdf" ||
                                                    "Hanya file PDF yang diperbolehkan"
                                                );
                                            },
                                            maxSize: (files) => {
                                                const maxSize = 5 * 1024 * 1024; // 5MB
                                                return (
                                                    files[0]?.size <= maxSize ||
                                                    "Ukuran file harus kurang dari 5MB"
                                                );
                                            },
                                        },
                                    })}
                                />
                                {errors.file && <span className="invalid">{String(errors.file.message)}</span>}
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

export default ActivityComponent