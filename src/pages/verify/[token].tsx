import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardBody, Container, Row, Col, Spinner, Alert } from 'reactstrap';

interface VerificationData {
    registration_number: string;
    student_name: string;
    birth_place: string;
    birth_date: string;
    institution_name: string;
    program_name: string;
    boarding_name: string;
    registration_date: string;
    signer_name: string;
    status: string;
}

const VerifyRegistration = () => {
    const { token } = useParams<{ token: string }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<VerificationData | null>(null);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/verify-registration/${token}`);
                const result = await response.json();

                if (result.status === 'success') {
                    setData(result.data);
                } else {
                    setError(result.statusMessage || 'Token verifikasi tidak valid');
                }
                setLoading(false);
            } catch (err: any) {
                setError('Gagal memverifikasi token. Silakan coba lagi.');
                setLoading(false);
            }
        };

        if (token) {
            verifyToken();
        }
    }, [token]);

    const formatBirthDate = (birthPlace: string, birthDate: string) => {
        if (!birthDate) return birthPlace;
        const date = new Date(birthDate);
        const formattedDate = date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        return `${birthPlace}, ${formattedDate}`;
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <Container>
                    <Row className="justify-content-center">
                        <Col md={6} lg={5}>
                            <Card className="shadow-lg">
                                <CardBody className="text-center p-5">
                                    <Spinner color="primary" />
                                    <p className="mt-3 mb-0">Memverifikasi bukti pendaftaran...</p>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <Container>
                    <Row className="justify-content-center">
                        <Col md={6} lg={5}>
                            <Card className="shadow-lg">
                                <CardBody className="p-5">
                                    <div className="text-center mb-3">
                                        <span className="text-danger" style={{ fontSize: '64px' }}>❌</span>
                                    </div>
                                    <Alert color="danger" className="mb-0">
                                        <h4 className="alert-heading">Verifikasi Gagal</h4>
                                        <p className="mb-0">{error}</p>
                                    </Alert>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px 0'
        }}>
            <Container>
                <Row className="justify-content-center">
                    <Col md={8} lg={7}>
                        <Card className="shadow-lg">
                            <CardBody className="p-5">
                                <div className="text-center mb-4">
                                    <div className="mb-3">
                                        <span className="text-success" style={{ fontSize: '64px' }}>✅</span>
                                    </div>
                                    <h3 className="text-success mb-2">Bukti Pendaftaran Valid</h3>
                                    <p className="text-muted mb-0">Dokumen ini telah terverifikasi</p>
                                </div>

                                {data && (
                                    <div className="mt-4">
                                        <Alert color="danger" className="mb-4">
                                            <span className="me-2">⚠️</span>
                                            <strong>Pastikan data ini sama dengan data yang tertera dalam surat</strong>
                                        </Alert>

                                        <table className="table table-borderless mb-0">
                                            <tbody>
                                                <tr>
                                                    <td width="40%" className="py-2"><strong>Nomor Pendaftaran</strong></td>
                                                    <td className="py-2">: {data.registration_number}</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2"><strong>Nama Siswa</strong></td>
                                                    <td className="py-2">: {data.student_name}</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2"><strong>Tempat, Tanggal Lahir</strong></td>
                                                    <td className="py-2">: {formatBirthDate(data.birth_place, data.birth_date)}</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2"><strong>Lembaga</strong></td>
                                                    <td className="py-2">: {data.institution_name}</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2"><strong>Program</strong></td>
                                                    <td className="py-2">: {data.program_name}</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2"><strong>Boarding</strong></td>
                                                    <td className="py-2">: {data.boarding_name}</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2"><strong>Tanggal Pendaftaran</strong></td>
                                                    <td className="py-2">: {new Date(data.registration_date).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2"><strong>Penandatangan</strong></td>
                                                    <td className="py-2">: {data.signer_name}</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <Alert color="info" className="mt-4 mb-0">
                                            <span className="me-2">🔒</span>
                                            Dokumen ini ditandatangani secara digital dan telah terverifikasi oleh sistem.
                                        </Alert>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default VerifyRegistration;
