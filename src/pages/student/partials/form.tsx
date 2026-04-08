import React, { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type {
    InstitutionPeriodType, OptionsType,
    StudentAchievementType, StudentAddressFormType,
    StudentAddressType, StudentFileFormType, StudentFileType, StudentOriginType,
    StudentParentFormType, StudentParentType,
    StudentPersonalFormType,
    StudentPersonalType,
    StudentProgramType, StudentVerificationFormType, StudentVerificationType,
    UserType
} from "@/types";
import { Controller, useForm } from "react-hook-form";
import { Button, Icon, ImageContainer, Row, RSelect, RToast } from "@/components";
import { useYearContext } from "@/common/hooks/useYearContext";
import { useAuthContext } from "@/common/hooks/useAuthContext";
import { achievementChamp, achievementLevel, achievementType } from "@/helpers";
import { ButtonGroup, Modal, ModalBody, ModalHeader, Spinner } from "reactstrap";
import {
    CHAMP_ACHIEVEMENT_OPTIONS,
    GUARD_STATUS_OPTIONS,
    LEVEL_ACHIEVEMENT_OPTIONS,
    PARENT_JOB_OPTIONS,
    PARENT_STATUS_OPTIONS,
    PARENT_STUDY_OPTIONS,
    TYPE_ACHIEVEMENT_OPTIONS
} from "@/common/constants/form";

import {
    store as storeAchievement,
    update as updateAchievement,
    destroy as destroyAchievement
} from "@/common/api/student/achievement";
import {
    store as storeAddress,
    update as updateAddress,
    destroy as destroyAddress
} from "@/common/api/student/address";
import {
    store as storeFile,
    update as updateFile,
    destroy as destroyFile
} from "@/common/api/student/file";
import {
    store as storeOrigin,
    update as updateOrigin,
    destroy as destroyOrigin
} from "@/common/api/student/origin";
import {
    store as storeParent,
    update as updateParent,
    destroy as destroyParent
} from "@/common/api/student/parent";
import {
    store as storePersonal,
    update as updatePersonal,
    destroy as destroyPersonal
} from "@/common/api/student/personal";
import {
    store as storeProgram,
    update as updateProgram,
    destroy as destroyProgram
} from "@/common/api/student/program";
import {
    store as storeUser,
    update as updateUser,
    destroy as destroyUser
} from "@/common/api/user";
import {
    store as storeVerification,
    update as updateVerification
} from "@/common/api/student/verivication";
import UserForm from "@/components/pages/user/form";
import StudentPersonalForm from "@/components/pages/student/form/personal";
import StudentParentForm from "@/components/pages/student/form/parent";
import StudentAddressForm from "@/components/pages/student/form/address";
import StudentProgramForm from "@/components/pages/student/form/program";
import StudentOriginForm from "@/components/pages/student/form/origin";
import StudentFileForm from "@/components/pages/student/form/file";
import StudentVerificationForm from "@/components/pages/student/form/verification";
import moment from "moment";

export interface StudentAddInterface {
    user?: UserType
    personal?: StudentPersonalFormType
    parent?: StudentParentFormType
    address?: StudentAddressFormType
    program?: StudentProgramType
    origin?: StudentOriginType
    achievements?: StudentAchievementType[]
    file?: StudentFileFormType
    verification?: StudentVerificationType
}
interface StudentFormProps {
    activeIconTab?: string;
    setActiveIconTab: (activeIconTab: string) => void;
    formData?: StudentAddInterface,
    setFormData: Dispatch<SetStateAction<StudentAddInterface | undefined>>;
}

export const StudentUserForm = ({ setActiveIconTab, setFormData, formData }: StudentFormProps) => {
    const { user } = useAuthContext()
    const methods = useForm<UserType>()
    const { handleSubmit, reset } = methods
    const onSubmit = (values: UserType) => {
        const userData: UserType = {
            ...values,
            institutionId: user?.institutionId,
        }
        setFormData((prevState: StudentAddInterface | undefined) => ({ ...prevState, user: userData }))
        setActiveIconTab('2')
    }
    useEffect(() => {
        if (formData?.user) {
            reset(formData.user)
        }
    }, [formData?.user])
    return (
        <React.Fragment>
            <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                <UserForm methods={methods} />
                <Button outline color="info" type="submit">
                    <React.Fragment><Icon name="chevron-right-c" /> <span>LANJUT</span></React.Fragment>
                </Button>
            </form>
        </React.Fragment>
    )
}

export const PersonalForm = ({ setActiveIconTab, setFormData, formData }: StudentFormProps) => {
    const methods = useForm<StudentPersonalFormType>()
    const { handleSubmit, reset } = methods
    const onSubmit = (values: StudentPersonalFormType) => {
        setFormData((prevState: StudentAddInterface | undefined) => ({ ...prevState, personal: values }))
        setActiveIconTab('3')
    }
    useEffect(() => {
        if (formData?.personal) {
            reset({
                ...formData.personal,
                birthDate: formData.personal.birthDate ? new Date(formData.personal.birthDate) : undefined
            })
        }
    }, [formData?.personal])
    return (
        <React.Fragment>
            <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                <StudentPersonalForm methods={methods} />
                <Button outline color="info" type="submit">
                    <React.Fragment><Icon name="chevron-right-c" /> <span>LANJUT</span></React.Fragment>
                </Button>
            </form>
        </React.Fragment>
    )
}

export const ParentForm = ({ setActiveIconTab, setFormData, formData }: StudentFormProps) => {
    const methods = useForm<StudentParentFormType>()
    const { handleSubmit, reset } = methods
    const onSubmit = (values: StudentParentFormType) => {
        setFormData((prevState: StudentAddInterface | undefined) => ({ ...prevState, parent: values }))
        setActiveIconTab('4')
    }
    useEffect(() => {
        if (formData?.parent) {
            reset({
                ...formData.parent,
                fatherStatus: PARENT_STATUS_OPTIONS.find((item) => item.value === (formData.parent?.fatherStatus as unknown as number)),
                fatherStudy: PARENT_STUDY_OPTIONS.find((item) => item.value === (formData.parent?.fatherStudy as unknown as number)),
                fatherJob: PARENT_JOB_OPTIONS.find((item) => item.value === (formData.parent?.fatherJob as unknown as number)),
                motherStatus: PARENT_STATUS_OPTIONS.find((item) => item.value === (formData.parent?.motherStatus as unknown as number)),
                motherStudy: PARENT_STUDY_OPTIONS.find((item) => item.value === (formData.parent?.motherStudy as unknown as number)),
                motherJob: PARENT_JOB_OPTIONS.find((item) => item.value === (formData.parent?.motherJob as unknown as number)),
                guardStatus: GUARD_STATUS_OPTIONS.find((item) => item.value === (formData.parent?.guardStatus as unknown as number)),
                guardStudy: PARENT_STUDY_OPTIONS.find((item) => item.value === (formData.parent?.guardStudy as unknown as number)),
                guardJob: PARENT_JOB_OPTIONS.find((item) => item.value === (formData.parent?.guardJob as unknown as number)),
                fatherBirthDate: formData.parent.fatherBirthDate ? new Date(formData.parent.fatherBirthDate) : undefined,
                motherBirthDate: formData.parent.motherBirthDate ? new Date(formData.parent.motherBirthDate) : undefined,
                guardBirthDate: formData.parent.guardBirthDate ? new Date(formData.parent.guardBirthDate) : undefined,
            } as any)
        }
    }, [formData?.parent])

    return (
        <React.Fragment>
            <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                <StudentParentForm methods={methods} />
                <Button outline color="info" type="submit">
                    <React.Fragment><Icon name="chevron-right-c" /> <span>LANJUT</span></React.Fragment>
                </Button>
            </form>
        </React.Fragment>
    )
}

export const AddressForm = ({ setActiveIconTab, setFormData, formData }: StudentFormProps) => {
    const methods = useForm<StudentAddressFormType>()
    const { handleSubmit, reset } = methods
    const onSubmit = (values: StudentAddressFormType) => {
        setFormData((prevState: StudentAddInterface | undefined) => ({ ...prevState, address: values }))
        setActiveIconTab('5')
    }
    useEffect(() => {
        if (formData?.address) {
            // Parse JSON strings if they are strings, otherwise use as is
            const parseOption = (val: any) => {
                try {
                    return typeof val === 'string' ? JSON.parse(val) : val;
                } catch (e) {
                    return val;
                }
            };
            reset({
                ...formData.address,
                province: parseOption(formData.address.province),
                city: parseOption(formData.address.city),
                district: parseOption(formData.address.district),
                village: parseOption(formData.address.village),
            } as any)
        }
    }, [formData?.address])
    return (
        <React.Fragment>
            <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                <StudentAddressForm methods={methods} />
                <Button outline color="info" type="submit">
                    <React.Fragment><Icon name="chevron-right-c" /> <span>LANJUT</span></React.Fragment>
                </Button>
            </form>
        </React.Fragment>
    )
}

export const ProgramForm = ({ setActiveIconTab, setFormData, formData }: StudentFormProps) => {
    const year = useYearContext()
    const methods = useForm<StudentProgramType>()
    const { user } = useAuthContext()
    const { handleSubmit, setValue, reset } = methods
    const [period, setPeriod] = useState<InstitutionPeriodType>()
    const onSubmit = (values: StudentProgramType) => {
        setFormData((prevState: StudentAddInterface | undefined) => ({ ...prevState, program: values }))
        setActiveIconTab('6')
    }
    useEffect(() => {
        setValue('yearId', year?.id)
        setValue('institutionId', user?.institutionId)
        setValue('periodId', period?.id)
    }, [user, period]); // Added period to dependency to update when period changes

    useEffect(() => {
        if (formData?.program) {
            reset(formData.program)
        }
    }, [formData?.program])

    return (
        <React.Fragment>
            <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                <StudentProgramForm methods={methods} user={user} setPeriod={setPeriod} />
                <Button outline color="info" type="submit">
                    <React.Fragment><Icon name="chevron-right-c" /> <span>LANJUT</span></React.Fragment>
                </Button>
            </form>
        </React.Fragment>
    )
}

export const OriginForm = ({ setActiveIconTab, setFormData, formData }: StudentFormProps) => {
    const methods = useForm<StudentOriginType>()
    const { handleSubmit, reset } = methods
    const onSubmit = (values: StudentOriginType) => {
        setFormData((prevState: StudentAddInterface | undefined) => ({ ...prevState, origin: values }))
        setActiveIconTab('7')
    }
    useEffect(() => {
        if (formData?.origin) {
            reset(formData.origin)
        }
    }, [formData?.origin])

    return (
        <React.Fragment>
            <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                <StudentOriginForm methods={methods} />
                <Button outline color="info" type="submit">
                    <React.Fragment><Icon name="chevron-right-c" /> <span>LANJUT</span></React.Fragment>
                </Button>
            </form>
        </React.Fragment>
    )
}

export const AchievementForm = ({ setActiveIconTab, setFormData, formData }: StudentFormProps) => {
    const year = useYearContext()
    const { control, formState: { errors }, handleSubmit, register, reset, setValue } = useForm<StudentAchievementType>()
    const [loading, setLoading] = useState(false)
    const [modal, setModal] = useState(false)
    const [achievements, setAchievements] = useState<StudentAchievementType[]>(formData?.achievements || [])
    const [achievement, setAchievement] = useState<StudentAchievementType>()
    const onSubmit = (values: StudentAchievementType) => {
        setLoading(true);
        const formData = {
            ...values,
            image: values.image[0],
        }
        setAchievements([...achievements, formData])
        toggle()
        setLoading(false);
        console.log(formData)
    }
    const onDelete = (id?: number) => {
        destroyAchievement(id)
        const achievementsFilter = achievements.filter((item) => item.id !== id)
        setAchievements(achievementsFilter)
    }
    const toggle = () => {
        setModal(false);
        setAchievement({
            yearId: year?.id,
            level: undefined,
            champ: undefined,
            type: undefined,
            name: '',
            file: '',
        })
        reset()
    };

    useEffect(() => {
        setFormData((prevState: StudentAddInterface | undefined) => ({ ...prevState, achievements }))
    }, [achievements]);

    useEffect(() => {
        if (formData?.achievements) {
            setAchievements(formData.achievements)
        }
        console.log(formData?.achievements)
    }, [formData?.achievements])

    useEffect(() => {
        setValue('yearId', year?.id)
        setValue('level', achievement?.level)
        setValue('champ', achievement?.champ)
        setValue('type', achievement?.type)
        setValue('name', achievement ? achievement.name : '')
        setValue('file', achievement ? achievement.file : '')
    }, [achievement])
    return (
        <React.Fragment>
            <div className="table-responsive mb-3">
                <table className="table table-bordered table-responsive">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Tingkat</th>
                            <th scope="col">Juara</th>
                            <th scope="col">Jenis</th>
                            <th scope="col">Nama Event</th>
                            <th scope="col">Berkas</th>
                            <th scope="col">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {achievements?.map((item, idx) => (
                            <tr key={idx}>
                                <th scope="row">{idx + 1}</th>
                                <td>{achievementLevel(item.level)}</td>
                                <td>{achievementChamp(item.champ)}</td>
                                <td>{achievementType(item.type)}</td>
                                <td>{item.name}</td>
                                <td><ImageContainer isIcon img={item.file} /></td>
                                <td>
                                    <ButtonGroup size="sm">
                                        <Button color="warning" outline><Icon name="edit" onClick={() => {
                                            setAchievement(item)
                                            setModal(true)
                                        }} /></Button>
                                        <Button color="danger" outline><Icon name="trash" onClick={() => {
                                            onDelete(item?.id)
                                        }} /></Button>
                                    </ButtonGroup>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={7}>
                                <center>
                                    <Button
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={() => setModal(true)}>
                                        Tambah
                                    </Button>
                                </center>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <Button outline color="info" type="button" onClick={() => setActiveIconTab('8')}>
                <React.Fragment><Icon name="chevron-right-c" /> <span>LANJUT</span></React.Fragment>
            </Button>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle} close={
                    <button className="close" onClick={toggle}>
                        <Icon name="cross" />
                    </button>
                }>
                    {achievement?.id === undefined ? 'TAMBAH' : 'UBAH'}
                </ModalHeader>
                <ModalBody>
                    <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                        <Row className="gy-0">
                            <div className="form-group col-md-4">
                                <label className="form-label" htmlFor="level">Tingkat</label>
                                <div className="form-control-wrap">
                                    <Controller
                                        control={control}
                                        name="level"
                                        rules={{ required: "Tingkat tidak boleh kosong" }}
                                        render={({ field: { value, onChange } }) => (
                                            <React.Fragment>
                                                <RSelect
                                                    options={LEVEL_ACHIEVEMENT_OPTIONS}
                                                    value={LEVEL_ACHIEVEMENT_OPTIONS.find((item) => item.value === value)}
                                                    onChange={(val) => onChange(val?.value)}
                                                    placeholder="Pilih Aktif"
                                                />
                                                <input type="hidden" id="level" className="form-control" />
                                                {errors.level && <span className="invalid">Kolom tidak boleh kosong.</span>}
                                            </React.Fragment>
                                        )
                                        } />
                                </div>
                            </div>
                            <div className="form-group col-md-4">
                                <label className="form-label" htmlFor="champ">Juara</label>
                                <div className="form-control-wrap">
                                    <Controller
                                        control={control}
                                        name="champ"
                                        rules={{ required: "Tingkat tidak boleh kosong" }}
                                        render={({ field: { value, onChange } }) => (
                                            <React.Fragment>
                                                <RSelect
                                                    options={CHAMP_ACHIEVEMENT_OPTIONS}
                                                    value={CHAMP_ACHIEVEMENT_OPTIONS.find((item) => item.value === value)}
                                                    onChange={(val) => onChange(val?.value)}
                                                    placeholder="Pilih Aktif"
                                                />
                                                <input type="hidden" id="champ" className="form-control" />
                                                {errors.champ && <span className="invalid">Kolom tidak boleh kosong.</span>}
                                            </React.Fragment>
                                        )
                                        } />
                                </div>
                            </div>
                            <div className="form-group col-md-4">
                                <label className="form-label" htmlFor="type">Jenis</label>
                                <div className="form-control-wrap">
                                    <Controller
                                        control={control}
                                        name="type"
                                        rules={{ required: "Tingkat tidak boleh kosong" }}
                                        render={({ field: { value, onChange } }) => (
                                            <React.Fragment>
                                                <RSelect
                                                    options={TYPE_ACHIEVEMENT_OPTIONS}
                                                    value={TYPE_ACHIEVEMENT_OPTIONS.find((item) => item.value === value)}
                                                    onChange={(val) => onChange(val?.value)}
                                                    placeholder="Pilih Aktif"
                                                />
                                                <input type="hidden" id="type" className="form-control" />
                                                {errors.type && <span className="invalid">Kolom tidak boleh kosong.</span>}
                                            </React.Fragment>
                                        )
                                        } />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="name">Nama Event</label>
                                <div className="form-control-wrap">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        placeholder="Ex. Jepara Inovatioan Award Vol. 2 UNISNU Jepara"
                                        {...register("name", { required: true })}
                                    />
                                    {errors.name && <span className="invalid">Kolom tidak boleh kosong</span>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="image">Scan/Foto Sertifikat</label>
                                <div className="form-control-wrap">
                                    <input
                                        type="file"
                                        id="image"
                                        className="form-control"
                                        {...register("image", {
                                            required: "Berkas tidak boleh kosong.",
                                            validate: {
                                                fileSize: (files) => files[0]?.size < 2000000 || "Ukuran file harus kurang dari 2 MB",
                                                fileType: (files) => ['image/jpeg', 'image/png', 'image/jpg'].includes(files[0]?.type) || "Hanya file JPEG/JPG/PNG yang diperbolehkan",
                                            }
                                        })}
                                    />
                                    {errors.image && <span className="invalid">{String(errors.image.message)}</span>}
                                </div>
                            </div>
                            <div className="form-group">
                                <Button color="primary" type="submit" size="md">
                                    {loading ? <Spinner size="sm" /> : 'SIMPAN'}
                                </Button>
                            </div>
                        </Row>
                    </form>
                </ModalBody>
            </Modal>
        </React.Fragment>
    )
}

export const FileForm = ({ setActiveIconTab, setFormData, formData }: StudentFormProps) => {
    const methods = useForm<StudentFileFormType>()
    const { handleSubmit, reset } = methods
    const [file, setFile] = useState<StudentFileType>()
    const onSubmit = (values: StudentFileFormType) => {
        const payload: any = { ...values };
        // Extract FileList into array so it survives state updates
        for (const key in payload) {
            if (payload[key] instanceof FileList) {
                payload[key] = Array.from(payload[key]);
            }
        }
        setFormData((prevState: StudentAddInterface | undefined) => ({ ...prevState, file: payload }))
        setActiveIconTab('9')
    }
    useEffect(() => {
        if (formData?.file) {
            setFile(formData.file as unknown as StudentFileType);
            reset(formData.file as unknown as StudentFileFormType);
        }
    }, [formData?.file])
    return (
        <React.Fragment>
            <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                <StudentFileForm methods={methods} file={file} />
                <Button outline color="info" type="submit">
                    <React.Fragment><Icon name="chevron-right-c" /> <span>LANJUT</span></React.Fragment>
                </Button>
            </form>
        </React.Fragment>
    )
}

const VerificationForm = ({ formData }: StudentFormProps) => {
    const methods = useForm<StudentVerificationFormType>()
    const { handleSubmit, reset } = methods
    const { user } = useAuthContext()
    const [loading, setLoading] = useState(false)

    const statusOptions: OptionsType[] = [
        { value: 2, label: "Tidak" },
        { value: 1, label: "Ya" },
    ];

    useEffect(() => {
        if (formData?.verification) {
            reset({
                ...formData.verification,
                twins: statusOptions.find(o => o.value === (formData?.verification?.twins as unknown as number)),
                graduate: statusOptions.find(o => o.value === (formData?.verification?.graduate as unknown as number)),
                domicile: statusOptions.find(o => o.value === (formData?.verification?.domicile as unknown as number)),
                student: statusOptions.find(o => o.value === (formData?.verification?.student as unknown as number)),
                teacherSon: statusOptions.find(o => o.value === (formData?.verification?.teacherSon as unknown as number)),
                sibling: statusOptions.find(o => o.value === (formData?.verification?.sibling as unknown as number)),
            } as any)
        }
    }, [formData?.verification])

    const onSubmit = async (values: StudentVerificationFormType) => {
        setLoading(true)
        try {
            if (formData?.user?.id) {
                const userId = formData.user.id;
                if (formData.user) {
                    await updateUser({ ...formData.user, id: userId, institutionId: user?.institutionId, role: 4 }, false);
                }
                if (formData.personal) {
                    const personalFormData = {
                        ...formData.personal,
                        id: formData.personal.id,
                        userId: userId,
                        birthDate: moment(formData.personal.birthDate).format("YYYY-MM-DD"),
                    };
                    await updatePersonal(personalFormData, false);
                }
                if (formData.parent) {
                    const parentFormData = {
                        ...formData.parent,
                        id: formData.parent.id,
                        userId: userId,
                        fatherStatus: formData.parent.fatherStatus?.value ?? 0,
                        fatherBirthDate: moment(formData.parent.fatherBirthDate).format("YYYY-MM-DD"),
                        fatherStudy: formData.parent.fatherStudy?.value ?? 0,
                        fatherJob: formData.parent.fatherJob?.value ?? 0,
                        motherStatus: formData.parent.motherStatus?.value ?? 0,
                        motherBirthDate: moment(formData.parent.motherBirthDate).format("YYYY-MM-DD"),
                        motherStudy: formData.parent.motherStudy?.value ?? 0,
                        motherJob: formData.parent.motherJob?.value ?? 0,
                        motherPhone: formData.parent.motherPhone,
                        guardStatus: formData.parent.guardStatus?.value ?? 0,
                        guardBirthDate: moment(formData.parent.guardBirthDate).format("YYYY-MM-DD"),
                        guardStudy: formData.parent.guardStudy?.value ?? 0,
                        guardJob: formData.parent.guardJob?.value ?? 0,
                    } as any;
                    await updateParent(parentFormData, false);
                }
                if (formData.address) {
                    const addressFormData = {
                        ...formData.address,
                        id: formData.address.id,
                        userId: userId,
                        province: JSON.stringify(formData.address.province),
                        city: JSON.stringify(formData.address.city),
                        district: JSON.stringify(formData.address.district),
                        village: JSON.stringify(formData.address.village),
                    };
                    await updateAddress(addressFormData, false);
                }
                if (formData.program) {
                    await updateProgram({ ...formData.program, id: formData.program.id, userId: userId }, false);
                }
                if (formData.origin) {
                    await updateOrigin({ ...formData.origin, id: formData.origin.id, userId: userId }, false);
                }

                if (formData.achievements) {
                    for (const achievement of formData.achievements) {
                        const achievementFormData = { ...achievement, userId: userId };
                        if (achievement.id) {
                            await updateAchievement({ ...achievementFormData, id: achievement.id }, false);
                        } else {
                            await storeAchievement(achievementFormData, false);
                        }
                    }
                }
                if (formData.file) {
                    const fileData = formData.file as any;
                    const fileFormData: any = {
                        id: fileData.id,
                        userId: userId,
                        numberAkta: fileData.numberAkta,
                        numberIjazah: fileData.numberIjazah,
                        numberSkl: fileData.numberSkl,
                        numberKip: fileData.numberKip,
                    };

                    if (fileData.imagePhoto && typeof fileData.imagePhoto !== 'string' && fileData.imagePhoto.length > 0) fileFormData.imagePhoto = fileData.imagePhoto[0];
                    if (fileData.imageKk && typeof fileData.imageKk !== 'string' && fileData.imageKk.length > 0) fileFormData.imageKk = fileData.imageKk[0];
                    if (fileData.imageKtp && typeof fileData.imageKtp !== 'string' && fileData.imageKtp.length > 0) fileFormData.imageKtp = fileData.imageKtp[0];
                    if (fileData.imageAkta && typeof fileData.imageAkta !== 'string' && fileData.imageAkta.length > 0) fileFormData.imageAkta = fileData.imageAkta[0];
                    if (fileData.imageIjazah && typeof fileData.imageIjazah !== 'string' && fileData.imageIjazah.length > 0) fileFormData.imageIjazah = fileData.imageIjazah[0];
                    if (fileData.imageSkl && typeof fileData.imageSkl !== 'string' && fileData.imageSkl.length > 0) fileFormData.imageSkl = fileData.imageSkl[0];
                    if (fileData.imageKip && typeof fileData.imageKip !== 'string' && fileData.imageKip.length > 0) fileFormData.imageKip = fileData.imageKip[0];

                    if (fileData.id) {
                        await updateFile(fileFormData, false);
                    } else {
                        await storeFile(fileFormData, false);
                    }
                }
                const verificationFormData = {
                    ...values,
                    id: formData.verification?.id,
                    userId: userId,
                    twins: values.twins.value,
                    graduate: values.graduate.value,
                    domicile: values.domicile.value,
                    student: values.student.value,
                    teacherSon: values.teacherSon.value,
                    sibling: values.sibling.value,
                    siblingInstitution: values.siblingInstitution?.value
                };

                if (formData.verification?.id) {
                    await updateVerification(verificationFormData, false);
                } else {
                    await storeVerification(verificationFormData, false);
                }

                RToast('Data Pendaftar berhasil diperbarui', 'success');

            } else {
                if (!formData?.user) return
                const userFormData: UserType = {
                    ...formData.user,
                    institutionId: user?.institutionId,
                    role: 4
                }
                const userResp = await storeUser(userFormData, false)
                if (userResp !== undefined) {
                    const { personal } = formData;
                    const personalFormData: Partial<StudentPersonalType> = {
                        ...personal,
                        userId: userResp?.id,
                        birthDate: moment(personal?.birthDate).format("YYYY-MM-DD"),
                    }
                    const personalResp = await storePersonal(personalFormData, false)
                    if (personalResp !== undefined) {
                        const { parent } = formData
                        const parentFormData: Partial<StudentParentType> = {
                            ...parent,
                            userId: userResp?.id,
                            fatherStatus: parent?.fatherStatus ? parent?.fatherStatus.value : 0,
                            fatherBirthDate: moment(parent?.fatherBirthDate).format("YYYY-MM-DD"),
                            fatherStudy: parent?.fatherStudy ? parent?.fatherStudy.value : 0,
                            fatherJob: parent?.fatherJob ? parent?.fatherJob.value : 0,
                            motherStatus: parent?.motherStatus ? parent?.motherStatus.value : 0,
                            motherBirthDate: moment(parent?.motherBirthDate).format("YYYY-MM-DD"),
                            motherStudy: parent?.motherStudy ? parent?.motherStudy.value : 0,
                            motherJob: parent?.motherJob ? parent?.motherJob.value : 0,
                            motherPhone: parent?.motherPhone,
                            guardStatus: parent?.guardStatus ? parent?.guardStatus.value : 0,
                            guardBirthDate: moment(parent?.guardBirthDate).format("YYYY-MM-DD"),
                            guardStudy: parent?.guardStudy ? parent?.guardStudy.value : 0,
                            guardJob: parent?.guardJob ? parent?.guardJob.value : 0,
                        }
                        const parentResp = await storeParent(parentFormData, false)
                        if (parentResp !== undefined) {
                            const { address } = formData;
                            const addressFormData: Partial<StudentAddressType> = {
                                ...address,
                                userId: userResp?.id,
                                province: JSON.stringify(address?.province),
                                city: JSON.stringify(address?.city),
                                district: JSON.stringify(address?.district),
                                village: JSON.stringify(address?.village),
                            }
                            const addressResp = await storeAddress(addressFormData, false)
                            if (addressResp !== undefined) {
                                const { program } = formData;
                                const programFormData: Partial<StudentProgramType> = {
                                    ...program,
                                    userId: userResp?.id,
                                }
                                const programResp = await storeProgram(programFormData, false)
                                if (programResp !== undefined) {
                                    const { origin } = formData
                                    const originFormData: Partial<StudentOriginType> = {
                                        ...origin,
                                        userId: userResp?.id,
                                    }
                                    const originResp = await storeOrigin(originFormData, false)
                                    if (originResp !== undefined) {
                                        const { achievements } = formData;
                                        if (achievements && achievements.length > 0) {
                                            await Promise.all(achievements.map(async (achievement: StudentAchievementType) => {
                                                const achievementFormData: Partial<StudentAchievementType> = {
                                                    ...achievement,
                                                    userId: userResp?.id,
                                                }
                                                return await storeAchievement(achievementFormData, false)
                                            }))
                                        }
                                        const { file } = formData
                                        const FileFormData: any = {
                                            userId: userResp?.id,
                                            ...file
                                        }

                                        const fileFields = ['imagePhoto', 'imageKk', 'imageKtp', 'imageAkta', 'imageIjazah', 'imageSkl', 'imageKip'];
                                        fileFields.forEach(field => {
                                            if (file && (file as any)[field] && typeof (file as any)[field] !== 'string' && (file as any)[field].length > 0) {
                                                FileFormData[field] = (file as any)[field][0];
                                            } else {
                                                delete FileFormData[field];
                                            }
                                        });
                                        const fileResp = await storeFile(FileFormData, false)
                                        if (fileResp !== undefined) {
                                            const verificationFormData: Partial<StudentVerificationType> = {
                                                ...values,
                                                userId: userResp?.id,
                                                twins: values.twins.value,
                                                graduate: values.graduate.value,
                                                domicile: values.domicile.value,
                                                student: values.student.value,
                                                teacherSon: values.teacherSon.value,
                                                sibling: values.sibling.value,
                                                siblingInstitution: values.siblingInstitution?.value
                                            }
                                            const verificationResp = await storeVerification(verificationFormData, false)
                                            if (verificationResp !== undefined) {
                                                RToast('Data Pendaftar berhasil ditambahkan', 'success')
                                            } else {
                                                await destroyFile(fileResp.id, false)
                                                await destroyOrigin(originResp.id, false)
                                                await destroyProgram(programResp.id, false)
                                                await destroyAddress(addressResp.id, false)
                                                await destroyParent(parentResp.id, false)
                                                await destroyPersonal(personalResp.id, false)
                                                await destroyUser(userResp.id, false)
                                            }
                                        }
                                    } else {
                                        await destroyProgram(programResp.id, false)
                                        await destroyAddress(addressResp.id, false)
                                        await destroyParent(parentResp.id, false)
                                        await destroyPersonal(personalResp.id, false)
                                        await destroyUser(userResp.id, false)
                                    }
                                } else {
                                    await destroyAddress(addressResp.id, false)
                                    await destroyParent(parentResp.id, false)
                                    await destroyPersonal(personalResp.id, false)
                                    await destroyUser(userResp.id, false)
                                }
                            } else {
                                await destroyParent(parentResp.id, false)
                                await destroyPersonal(personalResp.id, false)
                                await destroyUser(userResp.id, false)
                            }
                        } else {
                            await destroyPersonal(personalResp.id, false)
                            await destroyUser(userResp.id, false)
                        }
                    } else {
                        await destroyParent(userResp.id, false)
                    }
                }
            }
        } catch (e: any) {
            console.error(e)
            RToast(e.message || 'Terjadi kesalahan', 'error')
        } finally {
            setLoading(false)
        }
    }
    return (
        <React.Fragment>
            <form className="is-alter" onSubmit={handleSubmit(onSubmit)} >
                <StudentVerificationForm methods={methods} user={formData?.user} />
                <Button color="success" type="submit" disabled={loading}>
                    {loading
                        ? <Spinner size="sm" />
                        : (<React.Fragment><Icon name="save" /> <span>SIMPAN</span></React.Fragment>)
                    }
                </Button>
            </form>
        </React.Fragment>
    )
}
export default VerificationForm