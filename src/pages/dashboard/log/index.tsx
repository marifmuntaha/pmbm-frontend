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
import { getLogs, deleteLog, clearLogs, type PaginatedLogs, type SystemLogItem } from "@/common/api/systemLog";
import type { ColumnType } from "@/types";

const SystemLog = () => {
    const [loadData, setLoadData] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean | number | undefined>(false);
    const [logs, setLogs] = useState<SystemLogItem[]>([]);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(20);

    const getBadgeColor = (level: string) => {
        switch (level) {
            case "error": return "danger";
            case "warning": return "warning";
            case "transaction": return "success";
            default: return "info";
        }
    };

    const Column: ColumnType<SystemLogItem>[] = [
        {
            name: "Waktu",
            selector: (row) => row.created_at,
            sortable: true,
            cell: (row) => (
                <span className="sub-text">
                    {new Date(row.created_at).toLocaleString('id-ID')}
                </span>
            )
        },
        {
            name: "Level",
            selector: (row) => row.level,
            sortable: true,
            cell: (row) => (
                <Badge color={getBadgeColor(row.level)}>
                    {row.level.toUpperCase()}
                </Badge>
            )
        },
        {
            name: "User",
            selector: (row) => row.user?.name || '-',
            sortable: false,
        },
        {
            name: "Pesan",
            selector: (row) => row.message,
            sortable: false,
        },
        {
            name: "IP Address",
            selector: (row) => row.ip_address || '-',
            sortable: false,
        },
        {
            name: "Aksi",
            selector: (row) => row.id,
            sortable: false,
            width: "100px",
            cell: (row) => (
                <ButtonGroup size="sm">
                    <Button outline color="danger" onClick={async () => {
                        if (window.confirm("Hapus log ini?")) {
                            setLoading(row.id);
                            await deleteLog(row.id)
                                .then(() => setLoadData(true))
                                .finally(() => setLoading(false));
                        }
                    }}>
                        {loading === row.id ? <Spinner size="sm" /> : <Icon name="trash" />}
                    </Button>
                </ButtonGroup>
            ),
        },
    ];

    const fetchLogs = (page: number, size: number = perPage) => {
        setLoadData(true);
        getLogs({ page, limit: size })
            .then((resp: PaginatedLogs | null) => {
                if (resp) {
                    setLogs(resp.data);
                    setTotalRows(resp.total);
                }
            })
            .finally(() => setLoadData(false));
    };

    const handlePageChange = (page: number) => {
        fetchLogs(page);
    };

    const handlePerRowsChange = async (newPerPage: number, page: number) => {
        setPerPage(newPerPage);
        fetchLogs(page, newPerPage);
    };

    const handleClear = async () => {
        if (window.confirm("Apakah Anda yakin ingin menghapus semua log?")) {
            setLoadData(true);
            await clearLogs()
                .then(() => setLoadData(true))
                .finally(() => setLoadData(false));
        }
    };

    useEffect(() => {
        if (loadData) {
            fetchLogs(1);
        }
    }, [loadData]);

    return (
        <React.Fragment>
            <Head title="Log Sistem" />
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Log Sistem</BlockTitle>
                                <p>Monitoring aktivitas backend, peringatan, dan kesalahan sistem.</p>
                            </BlockHeadContent>
                            <BlockHeadContent>
                                <ul className="nk-block-tools g-3">
                                    <li>
                                        <Button color="danger" size="sm" outline className="btn-white"
                                            onClick={handleClear}>
                                            <Icon name="trash-empty" />
                                            <span>BERSIHKAN SEMUA</span>
                                        </Button>
                                    </li>
                                    <li>
                                        <Button color="primary" size="sm" outline className="btn-white"
                                            onClick={() => setLoadData(true)}>
                                            <Icon name="redo" />
                                            <span>REFRESH</span>
                                        </Button>
                                    </li>
                                </ul>
                            </BlockHeadContent>
                        </BlockBetween>
                    </BlockHead>
                    <PreviewCard>
                        <ReactDataTable
                            data={logs}
                            columns={Column}
                            pagination
                            paginationServer
                            paginationTotalRows={totalRows}
                            onChangeRowsPerPage={handlePerRowsChange}
                            onChangePage={handlePageChange}
                            progressPending={loadData}
                        />
                    </PreviewCard>
                </Block>
            </Content>
        </React.Fragment>
    );
};

export default SystemLog;
