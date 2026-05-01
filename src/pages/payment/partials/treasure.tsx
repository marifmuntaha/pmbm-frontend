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
    ReactDataTable,
} from "@/components";
import { useYearContext } from "@/common/hooks/useYearContext";
import { useInstitutionContext } from "@/common/hooks/useInstitutionContext";
import {
    Badge,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Col,
    Row,
    FormGroup,
    Label,
    ButtonGroup,
    Spinner,
    Card
} from "reactstrap";
import { formatCurrency, formatNumber, getPaymentStatusColor, getPaymentStatusText } from "@/helpers";
import { studentInvoice } from "@/common/api/student";
import { cash as cashPayment, get as getPayment, sendWhatsapp } from "@/common/api/payment";
import { generateReceipt } from "@/common/api/payment/receipt";
import type { ColumnType, PaymentType, StudentInvoiceType } from "@/types";
import Select from "react-select";

const Treasure = () => {
    const year = useYearContext();
    const institution = useInstitutionContext();
    const [sm, updateSm] = useState(false);
    const [loadData, setLoadData] = useState(true);
    const [payments, setPayments] = useState<PaymentType[]>([]);
    const [students, setStudents] = useState<StudentInvoiceType[]>([]);
    const [sendingBuckWa, setSendingBuckWa] = useState(false)
    const [modal, setModal] = useState({
        cash: false,
        detail: false,
    });
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [selectedPayment, setSelectedPayment] = useState<PaymentType | null>(null);

    const [paymentAmount, setPaymentAmount] = useState<number>(0);

    const Column: ColumnType<PaymentType>[] = [
        {
            name: "Waktu",
            selector: (row) => row.transaction_time || row.created_at,
            sortable: true,
            width: "180px",
        },
        {
            name: "Siswa",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Invoice",
            selector: (row) => row.reference || '-',
            sortable: false,
        },
        {
            name: "Metode",
            selector: (row) => row.method === 1 ? 'Cash' : 'Midtrans',
            sortable: false,
        },
        {
            name: "Jumlah",
            selector: (row) => formatCurrency(row.amount),
            sortable: false,
            right: "true"
        },

        {
            name: 'Aksi',
            selector: (row: any) => row.id,
            sortable: false,
            cell: (item) => (
                <ButtonGroup size="sm">
                    <Button
                        outline
                        color="info"
                        onClick={() => {
                            setSelectedPayment(item);
                            setModal({ ...modal, detail: true });
                        }}
                        title="Detail Pembayaran"
                    >
                        <Icon name="eye" />
                    </Button>
                    {(Number(item.status) === 2 || item.status === 'PAID') && (
                        <Button
                            outline
                            color="success"
                            onClick={() => handleDownloadReceipt(item.id)}
                            title="Download Bukti Pembayaran"
                        >
                            <Icon name="download" />
                        </Button>
                    )}
                    <Button
                        outline
                        color="success"
                        onClick={() => {
                            sendWhatsapp(item.id);
                        }}
                        title="Kirim Notifikasi"
                    >
                        <Icon name="whatsapp" />
                    </Button>
                </ButtonGroup>
            )
        },
    ];

    useEffect(() => {
        if (loadData && year?.id && institution?.id) {
            getPayment<PaymentType>({ type: 'datatable', yearId: year.id, institutionId: institution.id })
                .then((resp) => {
                    setPayments(resp);
                })
                .finally(() => {
                    setLoadData(false);
                });
        }
    }, [loadData, year, institution]);

    const fetchStudents = () => {
        if (year?.id && institution?.id) {
            studentInvoice({ yearId: year.id, institutionId: institution.id })
                .then((resp) => {
                    const unpaid = resp.filter(s => s.invoice && s.invoice.status !== 'PAID');
                    setStudents(unpaid);
                });
        }
    };

    const handleCashPayment = () => {
        if (selectedStudent && selectedStudent.invoice) {
            cashPayment({
                userId: selectedStudent.userId,
                invoiceId: selectedStudent.invoice.id,
                method: 2,
                amount: paymentAmount
            }).then((resp) => {
                if (resp.status === 'success') {
                    setLoadData(true);
                    setModal({ ...modal, cash: false });
                    setSelectedStudent(null);
                    setPaymentAmount(0);
                }
            });
        }
    };

    const toggleModal = () => {
        if (!modal.cash) {
            fetchStudents();
        }
        setModal({ ...modal, cash: !modal.cash });
        setSelectedStudent(null);
        setPaymentAmount(0);
    };

    const handleDownloadReceipt = async (paymentId: number) => {
        try {
            const blob = await generateReceipt(paymentId, window.location.origin);

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `receipt-${paymentId}.pdf`;
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error: any) {
            console.error('Error downloading receipt:', error);
        }
    };

    const sendBuckWhatsapp = async () => {
        if (payments.length === 0) return;
        setSendingBuckWa(true);

        try {
            for (let i = 0; i < payments.length; i++) {
                const payment = payments[i];
                await sendWhatsapp(payment?.id, false);

                if (i < payments.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
            alert("Semua pesan berhasil dikirim!");
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            alert("Terjadi kesalahan saat mengirim pesan.");
        } finally {
            setSendingBuckWa(false);
        }
    }

    return (
        <React.Fragment>
            <Head title="Data Pembayaran" />
            <Content>
                <Block size="lg">
                    <BlockHead>
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h5">Data Pembayaran</BlockTitle>
                                <p>
                                    History Pembayaran Pendaftaran {institution?.surname} Tahun Ajaran {year?.name}
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
                                                <Button color="danger" onClick={toggleModal}>
                                                    <Icon name="money" /> <span>BAYAR CASH</span>
                                                </Button>
                                            </li>
                                            <li>
                                                <Button
                                                    color="success"
                                                    size="md"
                                                    onClick={() => sendBuckWhatsapp()}
                                                    disabled={sendingBuckWa}
                                                >
                                                    {sendingBuckWa ? <Spinner size="sm" /> : <Icon name="whatsapp" />}
                                                    <span>KIRIM SEMUA</span>
                                                </Button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </BlockHeadContent>
                        </BlockBetween>
                    </BlockHead>
                    <Row className="gy-4">
                        <Col md={4}>
                            <Card className="card-bordered border-primary">
                                <div className="card-inner">
                                    <div className="card-title-group align-start mb-2">
                                        <div className="card-title">
                                            <h6 className="title text-soft">TOTAL PEMBAYARAN</h6>
                                        </div>
                                        <div className="card-tools">
                                            <Icon name="coins" className="text-primary fs-4" />
                                        </div>
                                    </div>
                                    <div className="align-end flex-wrap g-3 justify-between">
                                        <div className="data">
                                            <div className="amount fw-bold">Rp. {formatCurrency(payments.reduce((acc, payment) => {
                                                return acc + payment.amount;
                                            }, 0))}</div>
                                            <div className="info">Total Transaksi</div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="card-bordered border-warning">
                                <div className="card-inner">
                                    <div className="card-title-group align-start mb-2">
                                        <div className="card-title">
                                            <h6 className="title text-soft">PEMBAYARAN CASH</h6>
                                        </div>
                                        <div className="card-tools">
                                            <Icon name="money" className="text-warning fs-4" />
                                        </div>
                                    </div>
                                    <div className="align-end flex-wrap g-3 justify-between">
                                        <div className="data">
                                            <div className="amount fw-bold">Rp. {formatCurrency(payments.filter((payment) => payment.method === 1).reduce((acc, payment) => {
                                                return acc + payment.amount;
                                            }, 0))}</div>
                                            <div className="info">Total Transaksi</div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="card-bordered border-info">
                                <div className="card-inner">
                                    <div className="card-title-group align-start mb-2">
                                        <div className="card-title">
                                            <h6 className="title text-soft">PEMBAYARAN ONLINE</h6>
                                        </div>
                                        <div className="card-tools">
                                            <Icon name="money" className="text-info fs-4" />
                                        </div>
                                    </div>
                                    <div className="align-end flex-wrap g-3 justify-between">
                                        <div className="data">
                                            <div className="amount fw-bold">Rp. {formatCurrency(payments.filter((payment) => payment.method === 2).reduce((acc, payment) => {
                                                return acc + payment.amount;
                                            }, 0))}</div>
                                            <div className="info">Total Transaksi</div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col md={12}>
                            <PreviewCard>
                                <ReactDataTable
                                    data={payments}
                                    columns={Column}
                                    pagination
                                    progressPending={loadData}
                                />
                            </PreviewCard>
                        </Col>
                    </Row>
                </Block>

                <Modal isOpen={modal.cash} toggle={toggleModal}>
                    <ModalHeader toggle={toggleModal}>Input Pembayaran Cash</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label>Pilih Siswa</Label>
                            <Select
                                options={students.map(s => ({
                                    value: s.userId,
                                    label: `${s.name} (${s.invoice?.reference}) - ${formatCurrency(s.invoice?.amount || 0)}`,
                                    data: s
                                }))}
                                onChange={(opt) => {
                                    setSelectedStudent(opt?.data);
                                    setPaymentAmount(opt?.data?.invoice?.amount || 0);
                                }}
                                placeholder="Cari nama siswa..."
                            />
                        </FormGroup>
                        {selectedStudent && (
                            <div className="mt-3">
                                <h6>Detail Pembayaran:</h6>
                                <Row className="gy-1 mb-3">
                                    <Col sm={4}><strong>Invoice</strong></Col>
                                    <Col sm={8}>: {selectedStudent.invoice?.reference}</Col>
                                    <Col sm={4}><strong>Total Tagihan</strong></Col>
                                    <Col sm={8}>: {formatCurrency(selectedStudent.invoice?.amount || 0)}</Col>
                                </Row>

                                <FormGroup>
                                    <Label>Jumlah Bayar</Label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formatCurrency(paymentAmount)}
                                        onChange={(e) => setPaymentAmount(formatNumber(e.target.value) || 0)}
                                        max={selectedStudent.invoice?.amount}
                                        min={1}
                                    />
                                    {paymentAmount < (selectedStudent.invoice?.amount || 0) && paymentAmount > 0 && (
                                        <div className="text-warning mt-1">
                                            <Icon name="info-fill" /> Sisa tagihan baru: {formatCurrency((selectedStudent.invoice?.amount || 0) - paymentAmount)}
                                        </div>
                                    )}
                                    {paymentAmount > (selectedStudent.invoice?.amount || 0) && (
                                        <div className="text-danger mt-1">
                                            Jumlah bayar tidak boleh melebihi total tagihan.
                                        </div>
                                    )}
                                </FormGroup>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        {selectedStudent && selectedStudent.invoice?.status === 'PAID' && (
                            <Button
                                color="success"
                                onClick={() => handleDownloadReceipt(selectedStudent.invoice?.id)}
                                title="Download Bukti Pembayaran"
                            >
                                <i className="ri-download-line"></i> Download Bukti
                            </Button>
                        )}
                        <Button
                            color="primary"
                            onClick={handleCashPayment}
                            disabled={!selectedStudent || paymentAmount <= 0 || paymentAmount > (selectedStudent.invoice?.amount || 0)}
                        >
                            Catat Pembayaran
                        </Button>
                        <Button color="secondary" onClick={toggleModal}>Batal</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={modal.detail} toggle={() => setModal({ ...modal, detail: !modal.detail })} size="lg">
                    <ModalHeader toggle={() => setModal({ ...modal, detail: !modal.detail })}>Detail Transaksi Pembayaran</ModalHeader>
                    <ModalBody>
                        {selectedPayment && (
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped">
                                    <tbody>
                                        <tr>
                                            <th style={{ width: '35%' }}>ID Transaksi</th>
                                            <td>{selectedPayment.transaction_id || '-'}</td>
                                        </tr>
                                        <tr>
                                            <th>Waktu Transaksi</th>
                                            <td>{selectedPayment.transaction_time || selectedPayment.created_at}</td>
                                        </tr>
                                        <tr>
                                            <th>Siswa</th>
                                            <td>{selectedPayment.name}</td>
                                        </tr>
                                        <tr>
                                            <th>Invoice</th>
                                            <td>{selectedPayment.reference}</td>
                                        </tr>
                                        <tr>
                                            <th>Metode Pembayaran</th>
                                            <td>
                                                <Badge
                                                    color={selectedPayment.method === 1 ? 'info' : 'warning'}
                                                >
                                                    {selectedPayment.method === 1 ? 'Cash' : 'Midtrans'}
                                                </Badge>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Status</th>
                                            <td>
                                                <Badge
                                                    pill
                                                    color={getPaymentStatusColor(selectedPayment.status)}
                                                >
                                                    {getPaymentStatusText(selectedPayment.status)}
                                                </Badge>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Jumlah</th>
                                            <td>
                                                <span className="fw-bold text-success">
                                                    {formatCurrency(selectedPayment.amount)}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => setModal({ ...modal, detail: false })}>Tutup</Button>
                    </ModalFooter>
                </Modal>
            </Content>
        </React.Fragment>
    );
};

export default Treasure;