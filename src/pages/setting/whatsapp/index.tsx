import React, { useEffect, useState } from "react";
import { Badge, ButtonGroup, Spinner } from "reactstrap";
import Head from "@/layout/head";
import Content from "@/layout/content";
import {
    Block,
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Button, Icon,
    PreviewCard,
    ReactDataTable
} from "@/components";
import { get as getWhatsapp, destroy as destroyWhatsapp } from "@/common/api/whatsapp";
import type { ColumnType, WhatsappType } from "@/types";
import Partial from "./partial";

const Whatsapp: React.FC = () => {
    const [sm, updateSm] = useState<boolean>(false);
    const [loadData, setLoadData] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean | number | undefined>(false);
    const [modal, setModal] = useState<boolean>(false);
    const [whatsapps, setWhatsapps] = useState<WhatsappType[]>([]);
    const [whatsapp, setWhatsapp] = useState<WhatsappType>({
        id: undefined,
        institutionId: undefined,
        device: '',
        active: 0,
        status: undefined,
    });
    const handleDestroy = async (id: number | undefined) => {
        setLoading(id);
        await destroyWhatsapp(id)
            .then(() => setLoadData(true))
            .finally(() => setLoading(false));
    }

    const Column: ColumnType<WhatsappType>[] = [
        {
            name: "Lembaga",
            selector: (row) => row.institution?.surname,
            sortable: false,
        },
        {
            name: "ID Whatsapp",
            selector: (row) => row?.device,
            sortable: false,
        },
        {
            name: "Aktif",
            selector: (row) => row.active,
            sortable: false,
            cell: (row) => (
                <Badge pill color={row.active ? 'success' : 'danger'}>
                    {row.active ? 'Ya' : 'Tidak'}
                </Badge>
            ),
        },
        {
            name: "status",
            selector: (row) => row.status,
            sortable: false,
            cell: (row) => (
                <Badge pill color={row.status ? 'success' : 'danger'}>
                    {row.status ? 'Ya' : 'Tidak'}
                </Badge>
            ),
        },
        {
            name: "Aksi",
            selector: (row) => row?.id,
            sortable: false,
            width: "150px",
            cell: (row) => (
                <ButtonGroup size="sm">
                    <Button outline color="info" onClick={() => {
                        setWhatsapp(row);
                        setModal(true);
                    }}>
                        <Icon name="scan" />
                    </Button>
                    <Button outline color="warning" onClick={() => {
                        setWhatsapp(row);
                        setModal(true);
                    }}>
                        <Icon name="pen" />
                    </Button>
                    <Button outline color="danger" onClick={() => handleDestroy(row?.id)}>
                        {loading === row.id ? <Spinner size="sm" /> : <Icon name="trash" />}
                    </Button>
                </ButtonGroup>
            ),
        },
    ];

    useEffect(() => {
        if (loadData) {
            getWhatsapp<WhatsappType>({ type: 'datatable' })
                .then((resp) => setWhatsapps(resp))
                .finally(() => setLoadData(false));
        }
    }, [loadData]);

    return (
        <React.Fragment>
            <Head title="Data Perangkat Whatsapp" />
            <Content page="component">
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Data Perangkat Whatsapp</BlockTitle>
                                <p>
                                    Textual form controls—like <code className="code-tag">&lt;input&gt;</code>s,{" "}
                                    <code className="code-tag">&lt;select&gt;</code>s, and{" "}
                                </p>
                            </BlockHeadContent>
                            <BlockHeadContent>
                                <div className="toggle-wrap nk-block-tools-toggle">
                                    <Button
                                        className={`btn-icon btn-trigger toggle-expand me-n1 ${sm ? "active" : ""}`}
                                        onClick={() => updateSm(!sm)}
                                    >
                                        <Icon name="menu-alt-r" />
                                    </Button>
                                    <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                                        <ul className="nk-block-tools g-3">
                                            <li>
                                                <Button color="primary" size="sm" outline className="btn-white"
                                                        onClick={() => setModal(true)}>
                                                    <Icon name="plus" />
                                                    <span>TAMBAH</span>
                                                </Button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </BlockHeadContent>
                        </BlockBetween>
                    </BlockHead>
                    <PreviewCard>
                        <ReactDataTable data={whatsapps} columns={Column} pagination progressPending={loadData} />
                    </PreviewCard>
                    <Partial modal={modal} setModal={setModal} whatsapp={whatsapp} setWhatsapp={setWhatsapp} setLoadData={setLoadData} />
                </Block>
            </Content>
        </React.Fragment>
    );
};

export default Whatsapp;
