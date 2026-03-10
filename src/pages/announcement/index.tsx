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
    Button,
    Icon,
    PreviewCard,
    ReactDataTable
} from "@/components";
import { get as getAnnouncements, destroy as destroyAnnouncement } from "@/common/api/announcement";
import type { AnnouncementType, ColumnType } from "@/types";
import Partial from "./partial";
import moment from "moment";
import { useAuthContext } from "@/common/hooks/useAuthContext";

const AnnouncementPage: React.FC = () => {
    const { user } = useAuthContext();
    const [sm, updateSm] = useState<boolean>(false);
    const [loadData, setLoadData] = useState<boolean>(true);
    const [loading, setLoading] = useState<number | null>(null);
    const [modal, setModal] = useState<boolean>(false);
    const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);
    const [announcement, setAnnouncement] = useState<AnnouncementType | null>(null);
    const columns: ColumnType<AnnouncementType>[] = [
        {
            name: "Tanggal",
            selector: (row: AnnouncementType) => row.created_at,
            sortable: true,
            cell: (row: AnnouncementType) => (
                <React.Fragment>
                    <span>{moment(row.created_at).format("DD MMM YYYY")}</span>
                    <span className="ms-1 small text-muted">{moment(row.created_at).format("HH:mm")}</span>
                </React.Fragment>
            )
        },
        {
            name: "Judul",
            selector: (row: AnnouncementType) => row.title,
            sortable: true,
        },
        {
            name: "Tipe",
            selector: (row: AnnouncementType) => row.type,
            sortable: true,
            cell: (row: AnnouncementType) => {
                let color = "secondary";
                let label: string = String(row.type);
                if (row.type === 1) {
                    color = "primary";
                    label = "Umum";
                } else if (row.type === 2) {
                    color = "info";
                    label = "Lembaga";
                } else if (row.type === 3) {
                    color = "warning";
                    label = "Pribadi";
                }
                return <Badge pill color={color}>{label}</Badge>;
            }
        },
        {
            name: "Kirim WA",
            selector: (row: AnnouncementType) => row.is_wa_sent ? 'Ya' : 'Tidak',
            sortable: true,
            cell: (row: AnnouncementType) => (
                <Badge pill color={row.is_wa_sent ? "success" : "danger"}>
                    {row.is_wa_sent ? "Ya" : "Tidak"}
                </Badge>
            )
        },
        {
            name: "Aksi",
            selector: (row: AnnouncementType) => row.id,
            sortable: false,
            cell: (row: AnnouncementType) => (
                <ButtonGroup size="sm">
                    <Button outline color="warning" onClick={() => {
                        setAnnouncement(row);
                        setModal(true);
                    }}>
                        <Icon name="pen" />
                    </Button>
                    <Button outline color="danger" onClick={async () => {
                        setLoading(row.id);
                        await destroyAnnouncement(row.id)
                            .then(() => setLoadData(true))
                            .finally(() => setLoading(null));
                    }}>
                        {loading === row.id ? <Spinner size="sm" /> : <Icon name="trash" />}
                    </Button>
                </ButtonGroup>
            )
        }
    ];

    useEffect(() => {
        if (loadData) {
            getAnnouncements()
                .then((resp) => setAnnouncements(resp || []))
                .finally(() => setLoadData(false));
        }
    }, [loadData]);

    return (
        <React.Fragment>
            <Head title="Pengumuman" />
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Pengumuman</BlockTitle>
                                <p>Kelola pengumuman untuk siswa dan lembaga.</p>
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
                                                <Button color="primary" size="sm" outline className="btn-white" onClick={() => setModal(true)}>
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
                        <ReactDataTable data={announcements} columns={columns} pagination progressPending={loadData} />
                    </PreviewCard>
                    <Partial
                        modal={modal}
                        setModal={setModal}
                        announcement={announcement}
                        setLoadData={setLoadData}
                        userRole={user?.role}
                        currentUser={user}
                    />
                </Block>
            </Content>
        </React.Fragment>
    );
};

export default AnnouncementPage;
