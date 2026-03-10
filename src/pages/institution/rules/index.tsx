import React, { useEffect, useState } from "react";
import { ButtonGroup, Spinner } from "reactstrap";
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
import { useAuthContext } from "@/common/hooks/useAuthContext";
import { get as getRules, destroy as destroyRule } from "@/common/api/master/rule";
import type { ColumnType, RuleType } from "@/types";
import Partial from "./partial";

const InstitutionRules: React.FC = () => {
    const { user } = useAuthContext();
    const [sm, updateSm] = useState<boolean>(false);
    const [loadData, setLoadData] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean | number | undefined>(false);
    const [modal, setModal] = useState<boolean>(false);
    const [rules, setRules] = useState<RuleType[]>([]);
    const [rule, setRule] = useState<RuleType>({
        content: '',
    });

    const columns: ColumnType<RuleType>[] = [
        {
            name: "#",
            selector: (row) => row.id,
            sortable: false,
            width: "50px",
        },
        {
            name: "Isi Aturan",
            selector: (row: RuleType) => row.content,
            sortable: false,
        },
        {
            name: "Aksi",
            selector: (row) => row.id,
            sortable: false,
            width: "150px",
            cell: (row) => (
                <ButtonGroup size="sm">
                    <Button outline color="warning" onClick={() => {
                        setRule(row);
                        setModal(true);
                    }}>
                        <Icon name="pen" />
                    </Button>
                    <Button outline color="danger" onClick={async () => {
                        if (confirm("Apakah anda yakin ingin menghapus aturan ini?")) {
                            setLoading(row?.id);
                            await destroyRule(row?.id)
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

    useEffect(() => {
        if (loadData) {
            // Fetch rules, controller will filter by operator's institutionId
            // Explicitly passing institutionId as a fallback/debug measure
            getRules({ institutionId: user?.institutionId })
                .then((resp) => setRules(resp))
                .catch((err) => console.error(err))
                .finally(() => setLoadData(false));
        }
    }, [loadData]);

    return (
        <React.Fragment>
            <Head title="Data Aturan Lembaga" />
            <Content page="component">
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Data Aturan Lembaga</BlockTitle>
                                <p>Manajemen aturan khusus untuk lembaga anda.</p>
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
                                                    onClick={() => {
                                                        setRule({ content: '' });
                                                        setModal(true);
                                                    }}>
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
                        <ReactDataTable data={rules} columns={columns} pagination progressPending={loadData} />
                    </PreviewCard>
                    <Partial modal={modal} setModal={setModal} rule={rule} setRule={setRule} setLoadData={setLoadData} />
                </Block>
            </Content>
        </React.Fragment>
    );
};

export default InstitutionRules;
