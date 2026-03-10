import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader, Form, Label, Button, Spinner, FormGroup } from "reactstrap";
import { create as createAnnouncement, update as updateAnnouncement } from "@/common/api/announcement";
import { get as getInstitution } from "@/common/api/institution";
import { get as getUser } from "@/common/api/user";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Icon, RSelect } from "@/components";
import { useYearContext } from "@/common/hooks/useYearContext";
import { useAuthContext } from "@/common/hooks/useAuthContext";
import type { AnnouncementType, OptionsType } from "@/types";

interface PartialProps {
    modal: boolean;
    setModal: (state: boolean) => void;
    announcement: AnnouncementType | null;
    setLoadData: (state: boolean) => void;
    userRole?: number;
    currentUser?: any;
}

const Partial: React.FC<PartialProps> = ({ modal, setModal, announcement, setLoadData }) => {
    const { user } = useAuthContext()
    const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<AnnouncementType>();
    const [isLoading, setIsLoading] = useState(false);
    const [institutionOptions, setInstitutionOptions] = useState<OptionsType[]>([]);
    const [userOptions, setUserOptions] = useState<OptionsType[]>([]);
    const year = useYearContext();
    const yearId = year?.id;
    const typeOptions: OptionsType[] = [
        { value: 1, label: 'Umum' },
        { value: 2, label: 'Lembaga' },
        { value: 3, label: 'Pribadi (Spesifik User)' }
    ];
    const onSubmit = async (data: AnnouncementType) => {
        console.log(data)
        setIsLoading(true);
        if (yearId) {
            data.yearId = yearId;
        }

        const promise = announcement
            ? updateAnnouncement(announcement.id, data)
            : createAnnouncement(data);

        await promise
            .then(() => {
                setLoadData(true);
                setModal(false);
                reset();
            })
            .finally(() => setIsLoading(false));
    };

    const toggle = () => setModal(!modal);

    const typeValue = useWatch({ control, name: 'type' });

    useEffect(() => {
        getInstitution<OptionsType>({ type: 'select' }).then((resp) => {
            setInstitutionOptions(resp);
        });

        const userParams: any = { type: 'select' };
        if (user?.role === 2 && user?.institutionId) {
            userParams.institutionId = user.institutionId;
        }

        getUser<OptionsType>(userParams).then((resp) => {
            setUserOptions(resp);
        });
    }, [user]);

    useEffect(() => {
        if (announcement) {
            setValue("title", announcement.title);
            setValue("description", announcement.description);
            setValue("type", announcement.type);
            setValue("is_wa_sent", announcement.is_wa_sent);
            setValue("user_id", announcement.user_id);
            setValue("institutionId", announcement.institutionId);
        } else {
            reset({
                type: 1,
                is_wa_sent: false
            } as AnnouncementType);
        }
    }, [announcement, modal]);

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>{announcement ? "Ubah" : "Tambah"}</ModalHeader>
            <ModalBody>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormGroup>
                        <Label>Judul</Label>
                        <input className="form-control" {...register("title", { required: true })} />
                        {errors.title && <span className="text-danger small">Judul wajib diisi</span>}
                    </FormGroup>

                    <FormGroup>
                        <Label>Deskripsi</Label>
                        <textarea className="form-control" rows={5} {...register("description", { required: true })}></textarea>
                        {errors.description && <span className="text-danger small">Deskripsi wajib diisi</span>}
                    </FormGroup>

                    <FormGroup>
                        <Label>Tipe Pengumuman</Label>
                        <Controller
                            name="type"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <RSelect
                                    {...field}
                                    options={typeOptions}
                                    value={typeOptions.find(option => option.value === field.value)}
                                    onChange={(option) => field.onChange(option?.value)}
                                />
                            )}
                        />
                    </FormGroup>

                    {typeValue === 3 && (
                        <FormGroup>
                            <Label>Pilih Pengguna</Label>
                            <Controller
                                name="user_id"
                                control={control}
                                rules={{ required: typeValue === 3 }}
                                render={({ field }) => (
                                    <RSelect
                                        {...field}
                                        options={userOptions}
                                        value={userOptions.find(option => option.value === field.value)}
                                        onChange={(option) => field.onChange(option?.value)}
                                        placeholder="Cari Pengguna..."
                                    />
                                )}
                            />
                            {errors.user_id && <span className="text-danger small">User wajib dipilih untuk pengumuman pribadi</span>}
                        </FormGroup>
                    )}

                    {typeValue === 2 && user?.role === 1 && (
                        <FormGroup>
                            <Label>Pilih Lembaga (Opsional jika Admin)</Label>
                            <Controller
                                name="institutionId"
                                control={control}
                                render={({ field }) => (
                                    <RSelect
                                        {...field}
                                        options={institutionOptions}
                                        value={institutionOptions.find(option => option.value === field.value)}
                                        onChange={(option: any) => field.onChange(option?.value)}
                                        placeholder="Cari Lembaga..."
                                    />
                                )}
                            />
                        </FormGroup>
                    )}

                    <FormGroup check className="mb-3">
                        <Label check>
                            <input type="checkbox" className="form-check-input" {...register("is_wa_sent")} />{' '}
                            Kirim Notifikasi WhatsApp
                        </Label>
                        <div className="form-text text-muted small">
                            Jika di centang, pesan akan dikirim ke nomor WhatsApp target (Bisa memakan waktu lama jika target banyak).
                        </div>
                    </FormGroup>

                    <div className="d-flex justify-content-end">
                        <Button color="primary" type="submit" disabled={isLoading}>
                            {isLoading ? <Spinner size="sm" /> : <Icon name="save" />} <span>Simpan</span>
                        </Button>
                    </div>
                </Form>
            </ModalBody>
        </Modal>
    );
};

export default Partial;
