import React, { useEffect, useState } from "react"
import Head from "@/layout/head"
import Content from "@/layout/content"
import { useForm } from "react-hook-form"
import type { InstitutionFormType, InstitutionType } from "@/types"
import {
    Block,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Col,
    PreviewCard,
    ImageContainer,
    Row,
} from "@/components"
import { Card } from "reactstrap"
import { useAuthContext } from "@/common/hooks/useAuthContext"
import InstitutionForm from "@/components/pages/institution/form"
import { show as showInstitution, update as updateInstitution } from "@/common/api/institution"
const Institution = () => {
    const { user } = useAuthContext()
    const [loading, setLoading] = useState(false)
    const [institution, setInstitution] = useState<InstitutionType>();
    const method = useForm<InstitutionFormType>()
    const { handleSubmit, setValue } = method
    const onSubmit = async (value: InstitutionFormType) => {
        const formData: InstitutionType = {
            id: value.id,
            name: value.name,
            surname: value.surname,
            tagline: value.tagline,
            npsn: value.npsn,
            nsm: value.nsm,
            address: value.address,
            phone: value.phone,
            email: value.email,
            website: value.website,
            head: value.head,
            image: value.file[0],
        }
        setLoading(true)
        await updateInstitution(formData).finally(() => setLoading(false));
    }
    useEffect(() => {
        const fetchInstitution = async () => {
            setLoading(true)
            try {
                const resp = await showInstitution({ id: user?.institutionId })
                setInstitution(resp)
                setValue("id", resp ? resp.id : 0)
                setValue("name", resp ? resp.name : "")
                setValue("surname", resp ? resp.surname : "")
                setValue("tagline", resp ? resp.tagline : "")
                setValue("npsn", resp ? resp.npsn : "")
                setValue("nsm", resp ? resp.nsm : "")
                setValue("address", resp ? resp.address : "")
                setValue("phone", resp ? resp.phone : "")
                setValue("email", resp ? resp.email : "")
                setValue("website", resp ? resp.website : "")
                setValue("head", resp ? resp.head : "")
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchInstitution()
    }, [])
    return (
        <React.Fragment>
            <Head title="Data Lembaga" />
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockHeadContent>
                            <BlockTitle tag="h5">Data Lembaga</BlockTitle>
                            <p>
                                Textual form controls—like <code className="code-tag">&lt;input&gt;</code>s,{" "}
                                <code className="code-tag">&lt;select&gt;</code>s, and{" "}
                            </p>
                        </BlockHeadContent>
                    </BlockHead>
                    <Row className="gy-0">
                        <Col md={8}>
                            <PreviewCard>
                                <form className="is-alter" onSubmit={handleSubmit(onSubmit)}>
                                    <InstitutionForm method={method} loading={loading} />
                                </form>
                            </PreviewCard>
                        </Col>
                        <Col md={4}>
                            <Card className="gallery">
                                <ImageContainer img={institution?.logo} />
                            </Card>
                        </Col>
                    </Row>
                </Block>
            </Content>
        </React.Fragment >
    )
}

export default Institution