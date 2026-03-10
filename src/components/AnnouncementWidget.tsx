import React, { useState } from "react";
import { Card, CardHeader, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, Button, Badge } from "reactstrap";
import moment from "moment";
import type { AnnouncementType } from "@/types";

interface AnnouncementWidgetProps {
    announcements: AnnouncementType[];
}

const AnnouncementWidget: React.FC<AnnouncementWidgetProps> = ({ announcements }) => {
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementType | null>(null);
    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const openAnnouncement = (item: AnnouncementType) => {
        setSelectedAnnouncement(item);
        setModal(true);
    };

    const getTypeBadge = (type: string | number) => {
        switch (type) {
            case 'global': return <Badge color="primary">Umum</Badge>;
            case 'institution': return <Badge color="info">Lembaga</Badge>;
            case 'specific': return <Badge color="warning">Pribadi</Badge>;
            default: return <Badge color="secondary">{type}</Badge>;
        }
    };

    return (
        <>
            <Card className="card-bordered shadow-sm rounded-4 border-0">
                <CardHeader className="bg-white border-bottom p-4">
                    <h5 className="fw-bold mb-0">Pengumuman Terbaru</h5>
                </CardHeader>
                <CardBody className="p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4 py-3 text-secondary text-uppercase small fw-bold">Tanggal</th>
                                    <th className="px-4 py-3 text-secondary text-uppercase small fw-bold">Judul Pengumuman</th>
                                    <th className="px-4 py-3 text-secondary text-uppercase small fw-bold text-center">Tipe</th>
                                </tr>
                            </thead>
                            <tbody>
                                {announcements && announcements.length > 0 ? (
                                    announcements.map((item) => (
                                        <tr key={item.id} onClick={() => openAnnouncement(item)} style={{ cursor: 'pointer' }}>
                                            <td className="px-4 py-3 text-nowrap" style={{ width: '200px' }}>
                                                <div className="d-flex align-items-center">
                                                    <i className="ni ni-calendar-grid-58 text-muted me-2"></i>
                                                    <span className="fw-medium text-dark">{moment(item.created_at).format('DD MMM YYYY')}</span>
                                                    <span className="text-muted small ms-2">{moment(item.created_at).format('HH:mm')}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="fw-medium text-dark">{item.title}</span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {getTypeBadge(item.type)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-5 text-center text-muted">
                                            <i className="ni ni-bell-55 fs-1 mb-3 d-block opacity-25"></i>
                                            Belum ada pengumuman saat ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>

            <Modal isOpen={modal} toggle={toggle} centered size="lg">
                <ModalHeader toggle={toggle}>
                    Detail Pengumuman
                </ModalHeader>
                <ModalBody>
                    {selectedAnnouncement && (
                        <div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="mb-0">{selectedAnnouncement.title}</h4>
                                {getTypeBadge(selectedAnnouncement.type)}
                            </div>
                            <p className="text-muted small mb-4">
                                <i className="ni ni-calendar-grid-58 me-1"></i>
                                {moment(selectedAnnouncement.created_at).format('DD MMMM YYYY, HH:mm')} WIB
                            </p>
                            <div className="p-3 bg-light rounded" style={{ whiteSpace: 'pre-wrap' }}>
                                {selectedAnnouncement.description}
                            </div>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggle}>Tutup</Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default AnnouncementWidget;
