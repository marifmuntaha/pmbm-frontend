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
import { get as getRoom, destroy as destroyRoom } from "@/common/api/master/room";
import type { ColumnType, RoomType } from "@/types";
import Partial from "./partial";

const Room: React.FC = () => {
    const [sm, updateSm] = useState<boolean>(false);
    const [loadData, setLoadData] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean | number | undefined>(false);
    const [modal, setModal] = useState<boolean>(false);
    const [rooms, setRooms] = useState<RoomType[]>([]);
    const [room, setRoom] = useState<RoomType>({
        id: undefined,
        name: '',
        capacity: undefined,
    });

    const Column: ColumnType<RoomType>[] = [
        {
            name: "Nama Kamar",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Kapasitas",
            selector: (row) => row.capacity || 0,
            sortable: true,
            cell: (row) => (
                <Badge color="info" pill>
                    {row.capacity} santri
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
                    <Button
                        outline
                        color="warning"
                        onClick={() => {
                            setRoom(row);
                            setModal(true);
                        }}
                    >
                        <Icon name="pen" />
                    </Button>
                    <Button
                        outline
                        color="danger"
                        onClick={async () => {
                            setLoading(row?.id);
                            await destroyRoom(row?.id)
                                .then(() => setLoadData(true))
                                .finally(() => setLoading(false));
                        }}
                    >
                        {loading === row.id ? <Spinner size="sm" /> : <Icon name="trash" />}
                    </Button>
                </ButtonGroup>
            ),
        },
    ];

    useEffect(() => {
        if (loadData) {
            getRoom({ list: 'table' })
                .then((resp) => setRooms(resp))
                .finally(() => setLoadData(false));
        }
    }, [loadData]);

    return (
        <React.Fragment>
            <Head title="Data Kamar Santri" />
            <Content page="component">
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Data Kamar Santri</BlockTitle>
                                <p>
                                    Kelola data kamar untuk santri boarding. Setiap kamar memiliki kapasitas maksimal santri yang dapat ditampung.
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
                                                <Button
                                                    color="primary"
                                                    size="sm"
                                                    outline
                                                    className="btn-white"
                                                    onClick={() => setModal(true)}
                                                >
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
                        <ReactDataTable
                            data={rooms}
                            columns={Column}
                            pagination
                            progressPending={loadData}
                        />
                    </PreviewCard>
                    <Partial
                        modal={modal}
                        setModal={setModal}
                        room={room}
                        setRoom={setRoom}
                        setLoadData={setLoadData}
                    />
                </Block>
            </Content>
        </React.Fragment>
    );
};

export default Room;
