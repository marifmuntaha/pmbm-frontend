import React, {useEffect, useState} from "react";
import {ButtonGroup, Spinner} from "reactstrap";
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
import {get as getUser, destroy as destroyUser} from "@/common/api/user";
import type {ColumnType, UserType} from "@/types";
import Partial from "./partial";
import {getRoleName} from "@/helpers";
import {useAuthContext} from "@/common/hooks/useAuthContext";

const User = () => {
    const auth = useAuthContext();
    const [sm, updateSm] = useState<boolean>(false);
    const [loadData, setLoadData] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean | number | undefined>(false);
    const [modal, setModal] = useState<boolean>(false);
    const [users, setUsers] = useState<UserType[]>([]);
    const [user, setUser] = useState<UserType>({
        id: undefined,
        institutionId: undefined,
        name: '',
        email: '',
        role: 0,
        phone: '',
        phone_verified_at: undefined
    });

    const Column: ColumnType<UserType>[] = [
        {
            name: "Lembaga",
            selector: (row) => row.institution ? row.institution.surname : '-',
            sortable: false,
        },
        {
            name: "Nama",
            selector: (row) => row.name,
            sortable: false,
        },
        {
            name: "Email",
            selector: (row) => row.email,
            sortable: false,
        },
        {
            name: "Telepon",
            selector: (row) => row.phone,
            sortable: false,
        },
        {
            name: "Hak Akses",
            selector: (row) => getRoleName(row.role),
            sortable: false,
        },
        {
            name: "Aksi",
            selector: (row) => row?.id,
            sortable: false,
            width: "150px",
            cell: (row) => (
                <ButtonGroup size="sm">
                    <Button outline color="warning" onClick={() => {
                        setUser(row);
                        setModal(true);
                    }}>
                        <Icon name="pen"/>
                    </Button>
                    <Button outline color="danger" onClick={async () => {
                        setLoading(row?.id);
                        await destroyUser(row?.id)
                            .then(() => setLoadData(true))
                            .finally(() => setLoading(false));
                    }}>
                        {loading === row.id ? <Spinner size="sm"/> : <Icon name="trash"/>}
                    </Button>
                </ButtonGroup>
            ),
        },
    ];

    useEffect(() => {
        const params = () => {
            if (auth.user?.role === 2) {
                return {
                    list: 'table',
                    with: 'institution',
                    institutionId: auth.user?.institutionId,
                }
            } else {
                return {
                    list: 'table',
                    with: 'institution',
                }
            }
        }
        if (loadData) {
            getUser<UserType>(params())
                .then((resp) => setUsers(resp))
                .finally(() => setLoadData(false));
        }
    }, [auth, loadData]);

    return (
        <React.Fragment>
            <Head title="Data Pengguna"/>
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Data Pengguna</BlockTitle>
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
                                        <Icon name="menu-alt-r"/>
                                    </Button>
                                    <div className="toggle-expand-content" style={{display: sm ? "block" : "none"}}>
                                        <ul className="nk-block-tools g-3">
                                            <li>
                                                <Button color="primary" size="sm" outline className="btn-white"
                                                        onClick={() => setModal(true)}>
                                                    <Icon name="plus"/>
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
                        <ReactDataTable data={users} columns={Column} pagination progressPending={loadData}/>
                    </PreviewCard>
                    <Partial modal={modal} setModal={setModal} user={user} setUser={setUser} setLoadData={setLoadData}/>
                </Block>
            </Content>
        </React.Fragment>
    );
};

export default User;
