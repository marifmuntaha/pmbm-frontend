import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Modal, ModalBody, ModalHeader, Spinner } from "reactstrap";
import { Icon, Row } from "@/components";
import { store, update } from "@/common/api/master/rule";
import type { RuleType } from "@/types";
import { RToast } from "@/components/toast";
import { useAuthContext } from "@/common/hooks/useAuthContext.ts";

interface PartialProps {
    modal: boolean;
    setModal: (modal: boolean) => void;
    rule: RuleType;
    setRule: (rule: RuleType) => void;
    setLoadData: (loadData: boolean) => void;
}

const Partial: React.FC<PartialProps> = ({ modal, setModal, rule, setRule, setLoadData }) => {
    const { user } = useAuthContext()
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<RuleType>();

    useEffect(() => {
        reset(rule);
    }, [rule, reset]);

    const toggle = () => {
        setModal(!modal);
        setRule({ content: '' });
        reset({ content: '' });
    };

    const onSubmit = async (data: RuleType) => {
        let formData: RuleType = data
        if (user?.role === 2) {
            formData = {
                ...data,
                institutionId: user.institutionId,
            }
            try {
                if (rule.id) await update({ ...data, id: rule.id });
                else await store(formData);
                setLoadData(true);
                toggle();
            } catch (error: any) {
                RToast(error.message || "Terjadi kesalahan", "error");
            }
        }
    };

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} close={
                <button className="close" onClick={toggle}>
                    <Icon name="cross" />
                </button>
            }>
                {rule.id ? "Ubah Aturan" : "Tambah Aturan"}
            </ModalHeader>
            <ModalBody>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Row className="g-3">
                        <div className="col-12">
                            <div className="form-group">
                                <label className="form-label" htmlFor="content">Isi Aturan</label>
                                <div className="form-control-wrap">
                                    <textarea
                                        className="form-control"
                                        id="content"
                                        rows={5}
                                        placeholder="Masukkan isi aturan..."
                                        {...register("content", { required: "Isi aturan harus diisi" })}
                                    />
                                    {errors.content && <span className="invalid">{errors.content.message}</span>}
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <Button color="primary" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Spinner size="sm" /> : "SIMPAN"}
                            </Button>
                        </div>
                    </Row>
                </form>
            </ModalBody>
        </Modal>
    );
}

export default Partial