import React, { useEffect, useState } from "react";
import {Badge, ButtonGroup, Spinner, Tooltip} from "reactstrap";
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
import Login from "./login";
import {useAuthContext} from "@/common/hooks/useAuthContext";

const Whatsapp: React.FC = () => {
    const { user } = useAuthContext();
    const [sm, updateSm] = useState<boolean>(false);
    const [loadData, setLoadData] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean | number | string | undefined>(false);
    const [tooltip, setTooltip] = useState({
        scan: false,
        destroy: false,
        reload: false,
        logout: false
    });
    const [modal, setModal] = useState<any>({
        partial: false,
        login: false,
    });
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
    const buttonAction = (data: WhatsappType) => {
        const {results} = data.status;
        if (results.state === "disconnected") {
            return (
                <ButtonGroup size="sm">
                    <Button outline color="info" id="scan" onClick={() => {
                        setWhatsapp(data);
                        setModal({
                            partial: false,
                            login: true,
                        })
                    }}>
                        <Icon name="scan" />
                    </Button>
                    <Tooltip placement="top" isOpen={tooltip.scan} target="scan" toggle={() => setTooltip({...tooltip, scan: !tooltip.scan})}>
                        Scan QRCode Whatsapp
                    </Tooltip>
                    <Button outline color="danger" id="destroy" onClick={() => handleDestroy(data?.id)}>
                        {loading === data.id ? <Spinner size="sm" /> : <Icon name="trash" />}
                    </Button>
                    <Tooltip placement="top" isOpen={tooltip.destroy} target="destroy" toggle={() => setTooltip({...tooltip, destroy: !tooltip.destroy})}>
                        Hapus Perangkat
                    </Tooltip>
                </ButtonGroup>
            )
        }
        if (results.state === "connected" || results.state === "logged_in") {
            return (
                <ButtonGroup size="sm">
                    <Button outline color="info" id="reload" onClick={() => {
                        alert("whatsapp terhubung")
                    }}>
                        <Icon name="reload" />
                    </Button>
                    <Tooltip placement="top" isOpen={tooltip.reload} target="reload" toggle={() => setTooltip({...tooltip, reload: !tooltip.reload})}>
                        Hubungkan Ulang Whatsapp
                    </Tooltip>
                    <Button outline color="danger" id="destroy" onClick={() => handleDestroy(data?.id)}>
                        {loading === data.id ? <Spinner size="sm" /> : <Icon name="trash" />}
                    </Button>
                    <Tooltip placement="top" isOpen={tooltip.destroy} target="destroy" toggle={() => setTooltip({...tooltip, destroy: !tooltip.destroy})}>
                        Hapus Perangkat
                    </Tooltip>
                </ButtonGroup>
            )
        }
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
            name: "Status",
            selector: (row) => row.status,
            sortable: false,
            cell: (row) => {
                const {results} = row.status
                if (results.state === "disconnected") {
                    return <Badge pill color='danger'>Tidak Terhubung</Badge>
                }
                if (results.is_connected === true && results.is_logged_in === false) {
                    return <Badge pill color='warning'>Perangkat Logout</Badge>
                }
                if (results.state === "logged_in") {
                    return <Badge pill color='success'>{results.jid}</Badge>
                }
            }
        },
        {
            name: "Aksi",
            selector: (row) => row?.id,
            sortable: false,
            width: "150px",
            cell: (row) => buttonAction(row),
        },
    ];

    const paramsFetch = () => {
        if (user?.role !== 1 ) {
            return {
                type: 'datatable',
                institutionId: user?.institutionId
            }
        } else {
            return {
                type: 'datatable',
            }
        }
    }

    useEffect(() => {
        if (loadData) {
            getWhatsapp<WhatsappType>(paramsFetch())
                .then((resp) => setWhatsapps(resp))
                .finally(() => setLoadData(false));
        }
    }, [loadData]);

    return (
        <React.Fragment>
            <Head title="Data Perangkat Whatsapp" />
            <Content>
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
                                                    onClick={() => setModal({ partial: true, login: false })}>
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
                    <Login modal={modal} setModal={setModal} whatsapp={whatsapp} setWhatsapp={setWhatsapp} />
                </Block>
            </Content>
        </React.Fragment>
    );
};

export default Whatsapp;
