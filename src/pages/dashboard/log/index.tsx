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
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean | number | undefined>(false);
    const [logs, setLogs] = useState<SystemLogItem[]>([]);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);

    const getBadgeColor = (level: string) => {
        switch (level) {
            case "error": return "danger";
            case "warning": return "warning";
            case "transaction": return "success";
            default: return "info";
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsFetching(true);
            await getLogs({ page: currentPage, limit: perPage })
                .then((resp: PaginatedLogs | null) => {
                    if (resp) {
                        setLogs(resp.data);
                        setTotalRows(resp.total);
                    }
                })
                .finally(() => setIsFetching(false));
        }
        fetchData();
    }, [currentPage, perPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePerRowsChange = (newPerPage: number, page: number) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
    };

    const handleRefresh = () => {
        setCurrentPage((prev) => {
            return prev;
        });
        setIsFetching(true);
        getLogs({ page: currentPage, limit: perPage })
            .then((resp: PaginatedLogs | null) => {
                if (resp) {
                    setLogs(resp.data);
                    setTotalRows(resp.total);
                }
            })
            .finally(() => setIsFetching(false));
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Hapus log ini?")) {
            setLoading(id);
            await deleteLog(id)
                .then(() => {
                    const remainingOnPage = logs.length - 1;
                    const targetPage = remainingOnPage === 0 && currentPage > 1
                        ? currentPage - 1
                        : currentPage;
                    setCurrentPage(targetPage);
                    if (targetPage === currentPage) {
                        setIsFetching(true);
                        getLogs({ page: currentPage, limit: perPage })
                            .then((resp: PaginatedLogs | null) => {
                                if (resp) {
                                    setLogs(resp.data);
                                    setTotalRows(resp.total);
                                }
                            })
                            .finally(() => setIsFetching(false));
                    }
                })
                .finally(() => setLoading(false));
        }
    };

    const handleClear = async () => {
        if (window.confirm("Apakah Anda yakin ingin menghapus semua log?")) {
            setIsFetching(true);
            await clearLogs()
                .then(() => {
                    setLogs([]);
                    setTotalRows(0);
                    setCurrentPage(1);
                })
                .finally(() => setIsFetching(false));
        }
    };

    const Column: ColumnType<SystemLogItem>[] = [
        {
            name: "Waktu",
            selector: (row) => row.created_at,
            sortable: false,
            width: "170px",
            cell: (row) => (
                <span className="sub-text">
                    {new Date(row.created_at).toLocaleString('id-ID')}
                </span>
            )
        },
        {
            name: "Level",
            selector: (row) => row.level,
            sortable: false,
            width: "100px",
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
            width: "250px",
        },
        {
            name: "Pesan",
            selector: (row) => row.message,
            sortable: false,
            width: "700px",
            wrap: true,
        },
        {
            name: "IP Address",
            selector: (row) => row.ip_address || '-',
            sortable: false,
            width: "150px",
        },
        {
            name: "Aksi",
            selector: (row) => row.id,
            sortable: false,
            width: "100px",
            right: "true",
            cell: (row) => (
                <ButtonGroup size="sm">
                    <Button outline color="danger" onClick={() => handleDelete(row.id)}>
                        {loading === row.id ? <Spinner size="sm" /> : <Icon name="trash" />}
                    </Button>
                </ButtonGroup>
            ),
        },
    ];

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
                                            onClick={handleRefresh}>
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
                            progressPending={isFetching}
                        />
                    </PreviewCard>
                </Block>
            </Content>
        </React.Fragment>
    );
};

export default SystemLog;
