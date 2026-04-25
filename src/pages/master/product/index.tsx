import React, { useEffect, useState } from "react";
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
import { useYearContext } from "@/common/hooks/useYearContext";
import Partial from "./partial";
import type { ColumnType, ProductType } from "@/types";
import { get as getProduct, destroy as destroyProduct } from "@/common/api/master/product";
import { useInstitutionContext } from "@/common/hooks/useInstitutionContext";
import { ButtonGroup, Spinner } from "reactstrap";
import { getGender, formatCurrency } from "@/helpers";

const Product = () => {
    const year = useYearContext()
    const institution = useInstitutionContext()
    const [sm, updateSm] = useState(false)
    const [modal, setModal] = useState(false)
    const [loading, setLoading] = useState<boolean | string | number | undefined>(false)
    const [loadData, setLoadData] = useState(true)
    const [products, setProducts] = useState<ProductType[]>([])
    const [product, setProduct] = useState<ProductType>({
        id: undefined,
        name: '',
        surname: '',
        price: null,
        gender: undefined,
        isBoarding: null,
        programId: null,
        boardingId: null
    })

    const Column: ColumnType<ProductType>[] = [
        {
            name: "Nama",
            selector: (row) => row.name,
            sortable: false,
        },
        {
            name: "Alias",
            selector: (row) => row.surname,
            sortable: false,
        },
        {
            name: "Harga",
            selector: (row) => "Rp. " + formatCurrency(row.price),
            sortable: false,
        },
        {
            name: "JK",
            selector: (row) => row.gender === 0 ? 'Semua' : getGender(row?.gender),
            sortable: false,
        },
        {
            name: "Program",
            selector: (row) => row.programId === 0 ? "Semua" : row.program?.name,
            sortable: false,
        },
        {
            name: "Boarding",
            selector: (row) => row.isBoarding === 1 ? row.boardingId === 0 ? "Semua" : row.boarding?.name : '',
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
                        setProduct(row);
                        setModal(true);
                    }}>
                        <Icon name="pen" />
                    </Button>
                    <Button outline color="danger" onClick={async () => {
                        setLoading(row?.id);
                        await destroyProduct(row?.id)
                            .then(() => setLoadData(true))
                            .finally(() => setLoading(false));
                    }}>
                        {loading === row.id ? <Spinner size="sm" /> : <Icon name="trash" />}
                    </Button>
                </ButtonGroup>
            ),
        },
    ];

    useEffect(() => {
        if (loadData) getProduct<ProductType>({ yearId: year?.id, institutionId: institution?.id, list: 'table' })
            .then((resp) => setProducts(resp))
            .finally(() => setLoadData(false));
    }, [loadData])

    return (
        <React.Fragment>
            <Head title="Item Pembayaran" />
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Item Pembayaran</BlockTitle>
                                <p>
                                    Item pembayaran tahun ajaran {year?.name}
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
                        <ReactDataTable data={products} columns={Column} pagination progressPending={loadData} />
                    </PreviewCard>
                </Block>
                <Partial modal={modal} setModal={setModal} product={product} setProduct={setProduct} setLoadData={setLoadData} />
            </Content>

        </React.Fragment>
    )
}

export default Product;