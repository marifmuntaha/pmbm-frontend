import React, { useEffect, useState } from "react";
import { Modal, ModalBody, Form, Row, Col, FormGroup, Label } from "reactstrap";
import { Button, RToast, RSelect } from "@/components";
import { useForm, Controller } from "react-hook-form";
import { update as updateGateway } from "@/common/api/payment/gateway";
import type { GatewayType, OptionsType } from "@/types";

interface Props {
    modal: boolean;
    setModal: (val: boolean) => void;
    gateway?: GatewayType;
    setLoadData: (val: boolean) => void;
}

const SettingsModal: React.FC<Props> = ({ modal, setModal, gateway, setLoadData }) => {
    const { register, handleSubmit, setValue, control } = useForm<GatewayType>();
    const [loading, setLoading] = useState(false);
    const modeOptions: OptionsType[] = [
        { value: 1, label: "Sandbox" },
        { value: 2, label: "Production" }
    ];
    useEffect(() => {
        if (gateway) {
            setValue('id', gateway.id)
            setValue("is_active", gateway.is_active);
            setValue("mode", gateway.mode);
            setValue("server_key", gateway.server_key);
            setValue("client_key", gateway.client_key);
            setValue("secret_key", gateway.secret_key);
        }
    }, [gateway, setValue]);

    const onSubmit = (data: GatewayType) => {
        setLoading(true);
        const formData = {
            ...data,
            is_active: data.is_active ? 1 : 0
        };

        updateGateway(formData, false).then(() => {
            RToast("Pengaturan berhasil disimpan", 'success');
            setLoadData(true);
            setModal(false);
        }).catch((err) => {
            RToast(err.message);
        }).finally(() => setLoading(false));
    };

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle} className="modal-dialog-centered" size="md">
            <ModalBody>
                <div className="p-2">
                    <h5 className="title">Konfigurasi {gateway?.provider}</h5>
                    <div className="mt-4">
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row className="g-3">
                                <Col md="12">
                                    <div className="custom-control custom-switch">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            id="isActiveSwitch"
                                            {...register("is_active")}
                                        />
                                        <label className="custom-control-label" htmlFor="isActiveSwitch">
                                            Aktifkan {gateway?.provider}
                                        </label>
                                    </div>
                                    <p className="text-muted small">Jika diaktifkan, metode pembayaran lain akan dinonaktifkan.</p>
                                </Col>
                                <Col md="12">
                                    <FormGroup>
                                        <Label>Mode</Label>
                                        <div className="form-control-wrap">
                                            <Controller
                                                name="mode"
                                                control={control}
                                                render={({ field: { value, onChange } }) => (
                                                    <RSelect
                                                        options={modeOptions}
                                                        value={modeOptions.find((c) => String(c.value) === String(value))}
                                                        onChange={(val: any) => onChange(val.value)}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </FormGroup>
                                </Col>
                                {gateway?.provider === 'midtrans' && (
                                    <>
                                        <Col md="12">
                                            <FormGroup>
                                                <Label>Server Key</Label>
                                                <div className="form-control-wrap">
                                                    <input className="form-control" type="text" {...register("server_key")} />
                                                </div>
                                            </FormGroup>
                                        </Col>
                                        <Col md="12">
                                            <FormGroup>
                                                <Label>Client Key</Label>
                                                <div className="form-control-wrap">
                                                    <input className="form-control" type="text" {...register("client_key")} />
                                                </div>
                                            </FormGroup>
                                        </Col>
                                    </>
                                )}
                                <Col size="12">
                                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                                        <li>
                                            <Button color="primary" type="submit" size="md">
                                                {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : "Simpan"}
                                            </Button>
                                        </li>
                                        <li>
                                            <Button onClick={toggle} className="link link-light">Batal</Button>
                                        </li>
                                    </ul>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default SettingsModal;
