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
import { get as getYear, destroy as destroyYear } from "@/common/api/master/year";
import type { ColumnType, YearType } from "@/types";
import Partial from "./partial";

const Major: React.FC = () => {
    const [sm, updateSm] = useState<boolean>(false);
    const [loadData, setLoadData] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean | number | undefined>(false);
    const [modal, setModal] = useState<boolean>(false);
    const [years, setYears] = useState<YearType[]>([]);
    const [year, setYear] = useState<YearType>({
        id: undefined,
        name: '',
        description: '',
        active: undefined,
    });
    const handleDestory = async (id: number | undefined) => {
        setLoading(id);
        await destroyYear(id)
            .then(() => setLoadData(true))
            .finally(() => setLoading(false));
    }

    const Column: ColumnType<YearType>[] = [
        {
            name: "Nama",
            selector: (row) => row.name,
            sortable: false,
        },
        {
            name: "Diskripsi",
            selector: (row) => row?.description,
            sortable: false,
        },
        {
            name: "Aktif",
            selector: (row) => row?.active,
            sortable: false,
            cell: (row) => (
                <Badge pill color={row.active === 1 ? 'success' : 'danger'}>
                    {row.active === 1 ? 'Ya' : 'Tidak'}
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
                    <Button outline color="warning" onClick={() => {
                        setYear(row);
                        setModal(true);
                    }}>
                        <Icon name="pen" />
                    </Button>
                    <Button outline color="danger" onClick={() => handleDestory(row?.id)}>
                        {loading === row.id ? <Spinner size="sm" /> : <Icon name="trash" />}
                    </Button>
                </ButtonGroup>
            ),
        },
    ];

    useEffect(() => {
        if (loadData) {
            getYear<YearType>({ list: 'table' })
                .then((resp) => setYears(resp))
                .finally(() => setLoadData(false));
        }
    }, [loadData]);

    return (
        <React.Fragment>
            <Head title="Data Tahun Pelajaran" />
            <Content page="component">
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Data Tahun Pelajaran</BlockTitle>
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
                        <ReactDataTable data={years} columns={Column} pagination progressPending={loadData} />
                    </PreviewCard>
                    <Partial modal={modal} setModal={setModal} year={year} setYear={setYear} setLoadData={setLoadData} />
                </Block>
            </Content>
        </React.Fragment>
    );
};

export default Major;
