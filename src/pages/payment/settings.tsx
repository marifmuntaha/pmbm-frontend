import React, { useEffect, useState } from "react";
import { Badge, ButtonGroup } from "reactstrap";
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
import { get as getGateway } from "@/common/api/payment/gateway";
import SettingsModal from "./settings-modal";
import type { ColumnType, GatewayType } from "@/types";

const PaymentSettings: React.FC = () => {
    const [loadData, setLoadData] = useState<boolean>(true);
    const [gateways, setGateways] = useState<GatewayType[]>([]);
    const [modal, setModal] = useState<boolean>(false);
    const [selectedGateway, setSelectedGateway] = useState<GatewayType | undefined>(undefined);

    useEffect(() => {
        if (loadData) {
            getGateway().then((resp) => {
                setGateways(resp);
            }).finally(() => setLoadData(false));
        }
    }, [loadData]);

    const handleEdit = (gateway: GatewayType) => {
        setSelectedGateway(gateway);
        setModal(true);
    };

    const Column: ColumnType<GatewayType>[] = [
        {
            name: "Provider",
            selector: (row) => row.provider,
            sortable: false,
            cell: (row) => <span className="text-capitalize">{row.provider}</span>,
        },
        {
            name: "Mode",
            selector: (row) => row.mode,
            sortable: false,
            cell: (row) => <span className="text-capitalize">{row.mode === 1 ? "Sandbox" : "Production"}</span>,
        },
        {
            name: "Status",
            selector: (row) => row.is_active,
            sortable: false,
            cell: (row) => (
                <Badge color={row.is_active ? "success" : "danger"}>
                    {row.is_active ? "Aktif" : "Non-Aktif"}
                </Badge>
            ),
        },
        {
            name: "Aksi",
            selector: (row) => row.id,
            sortable: false,
            width: "150px",
            cell: (row) => (
                <ButtonGroup size="sm">
                    <Button outline color="primary" onClick={() => handleEdit(row)}>
                        <Icon name="setting" />
                    </Button>
                </ButtonGroup>
            ),
        },
    ];

    return (
        <React.Fragment>
            <Head title="Pengaturan Pembayaran" />
            <Content page="component">
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Pengaturan Pembayaran</BlockTitle>
                                <p>Konfigurasi metode pembayaran Midtrans.</p>
                            </BlockHeadContent>
                        </BlockBetween>
                    </BlockHead>
                    <PreviewCard>
                        <ReactDataTable data={gateways} columns={Column} pagination progressPending={loadData} />
                    </PreviewCard>
                    <SettingsModal
                        modal={modal}
                        setModal={setModal}
                        gateway={selectedGateway}
                        setLoadData={setLoadData}
                    />
                </Block>
            </Content>
        </React.Fragment>
    );
};

export default PaymentSettings;
