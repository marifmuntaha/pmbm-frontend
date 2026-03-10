import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import exportFromJSON from "export-from-json";
import CopyToClipboard from 'react-copy-to-clipboard';
import { Col, Modal, ModalBody, Row, Button, Spinner } from "reactstrap";
import { DataTablePagination } from "@/components";

interface ExportProps<T> {
    data: T[]
}
interface ReactDataTableProps<T> {
    data: T[];
    columns: any[];
    pagination: boolean;
    actions?: boolean;
    className?: string;
    selectableRows?: boolean;
    expandableRows?: boolean;
    progressPending?: boolean;
    paginationServer?: boolean;
    paginationTotalRows?: number;
    onChangePage?: (page: number, totalRows: number) => void;
    onChangeRowsPerPage?: (currentRowsPerPage: number, currentPage: number) => void;
    searchPlaceholder?: string;
}

const Export = <T extends object>({ data }: ExportProps<T>) => {
    const [modal, setModal] = useState<boolean>(false);

    useEffect(() => {
        if (modal) {
            setTimeout(() => setModal(false), 2000);
        }
    }, [modal]);

    const fileName = "user-data";

    const exportCSV = () => {
        const exportType = exportFromJSON.types.csv;
        exportFromJSON({ data, fileName, exportType });
    };

    const exportExcel = () => {
        const exportType = exportFromJSON.types.xls;
        exportFromJSON({ data, fileName, exportType });
    };

    const copyToClipboard = () => {
        setModal(true);
    };

    return (
        <React.Fragment>
            <div className="dt-export-buttons d-flex align-center">
                <div className="dt-export-title d-none d-md-inline-block">Export</div>
                <div className="dt-buttons btn-group flex-wrap">
                    <CopyToClipboard text={JSON.stringify(data)}>
                        <Button className="buttons-copy buttons-html5" onClick={() => copyToClipboard()}>
                            <span>Copy</span>
                        </Button>
                    </CopyToClipboard>
                    <button className="btn btn-secondary buttons-csv buttons-html5" type="button"
                        onClick={() => exportCSV()}>
                        <span>CSV</span>
                    </button>
                    <button className="btn btn-secondary buttons-excel buttons-html5" type="button"
                        onClick={() => exportExcel()}>
                        <span>Excel</span>
                    </button>
                </div>
            </div>
            <Modal isOpen={modal} className="modal-dialog-centered text-center" size="sm">
                <ModalBody className="text-center m-2">
                    <h5>Copied to clipboard</h5>
                </ModalBody>
                <div className="p-3 bg-light">
                    <div className="text-center">Copied {data.length} rows to clipboard</div>
                </div>
            </Modal>
        </React.Fragment>
    );
};

const LoadingSpinner = () => (
    <div style={{ padding: '3px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spinner color="primary" size="sm" className="me-2" /> <span style={{ marginTop: '1px' }}>Memuat...</span>
    </div>
);

export const ReactDataTable = <T extends object>({
    data,
    columns,
    pagination,
    actions,
    className,
    selectableRows,
    expandableRows,
    progressPending,
    paginationServer,
    paginationTotalRows,
    onChangePage,
    onChangeRowsPerPage,
    searchPlaceholder,
}: ReactDataTableProps<T>) => {
    const [tableData, setTableData] = useState<T[]>(data);
    const [searchText, setSearchText] = useState<string>("");
    const [rowsPerPageS, setRowsPerPage] = useState<number>(10);
    const [mobileView, setMobileView] = useState<boolean>(false);

    useEffect(() => {
        setTableData(data);
    }, [data]);

    useEffect(() => {
        let defaultData = tableData;
        if (searchText !== "") {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            defaultData = data.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()));
            setTableData(defaultData);
        } else {
            setTableData(data);
        }
    }, [searchText, data]);

    // function to change the design view under 1200 px
    const viewChange = () => {
        if (window.innerWidth < 960 && expandableRows) {
            setMobileView(true);
        } else {
            setMobileView(false);
        }
    };

    useEffect(() => {
        window.addEventListener("load", viewChange);
        window.addEventListener("resize", viewChange);
        return () => {
            window.removeEventListener("resize", viewChange);
        };
    }, []);

    return (
        <div className={`dataTables_wrapper dt-bootstrap4 no-footer ${className ? className : ""}`}>
            <Row className={`justify-between g-2 ${actions ? "with-export" : ""}`}>
                <Col className="col-7 text-start" sm="4">
                    <div id="DataTables_Table_0_filter" className="dataTables_filter">
                        <label>
                            <input
                                type="search"
                                className="form-control form-control-sm"
                                placeholder={searchPlaceholder || "Pencarian by Nama"}
                                onChange={(ev) => setSearchText(ev.target.value)}
                            />
                        </label>
                    </div>
                </Col>
                <Col className="col-5 text-end" sm="8">
                    <div className="datatable-filter">
                        <div className="d-flex justify-content-end g-2">
                            {actions && <Export data={data} />}
                            <div className="dataTables_length" id="DataTables_Table_0_length">
                                <label>
                                    <span className="d-none d-sm-inline-block">Tampilkan</span>
                                    <div className="form-control-select">
                                        <select
                                            name="DataTables_Table_0_length"
                                            className="custom-select custom-select-sm form-control form-control-sm"
                                            onChange={(e) => setRowsPerPage(Number(e.target.value))}
                                            value={rowsPerPageS}
                                        >
                                            <option value="10">10</option>
                                            <option value="25">25</option>
                                            <option value="40">40</option>
                                            <option value="50">50</option>
                                        </select>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <DataTable
                data={tableData}
                columns={columns}
                className={className}
                selectableRows={selectableRows}
                expandableRows={mobileView}
                noDataComponent={<div className="p-2">Tidak ada data</div>}
                progressPending={progressPending}
                progressComponent={<LoadingSpinner />}
                sortIcon={
                    <div>
                        <span>&darr;</span>
                        <span>&uarr;</span>
                    </div>
                }
                pagination={pagination}
                paginationServer={paginationServer}
                paginationTotalRows={paginationTotalRows}
                onChangePage={onChangePage}
                onChangeRowsPerPage={onChangeRowsPerPage}
                paginationComponent={({ currentPage, rowsPerPage, rowCount, onChangePage, onChangeRowsPerPage }) => (
                    <DataTablePagination
                        customItemPerPage={rowsPerPageS}
                        itemPerPage={rowsPerPage}
                        totalItems={rowCount}
                        paginate={onChangePage}
                        currentPage={currentPage}
                        onChangeRowsPerPage={onChangeRowsPerPage}
                        setRowsPerPage={setRowsPerPage}
                    />
                )}
            />
        </div>
    );
};
