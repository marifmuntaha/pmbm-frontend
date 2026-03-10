import { apiCore } from '@/common/api/core';

/**
 * Download registration proof PDF
 */
async function downloadRegistrationProof(): Promise<void> {
    try {
        const api = new apiCore();

        // Get current frontend URL - use protocol and host to avoid query strings
        const frontendUrl = `${window.location.protocol}//${window.location.host}`;
        console.log('Frontend URL being sent:', frontendUrl);

        // Use apiCore.getFile which handles authentication automatically
        const response = await api.getFile(`/student/registration-proof?frontend_url=${encodeURIComponent(frontendUrl)}`);

        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;

        // Extract filename from Content-Disposition header if available
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'bukti-pendaftaran.pdf';

        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
            if (filenameMatch && filenameMatch[1]) {
                filename = filenameMatch[1];
            }
        }

        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error: any) {
        console.error('Error downloading registration proof:', error);

        // Handle error response
        if (error.response && error.response.data instanceof Blob) {
            // Convert blob error to JSON
            const text = await error.response.data.text();
            try {
                const errorData = JSON.parse(text);
                throw new Error(errorData.statusMessage || 'Gagal mengunduh bukti pendaftaran');
            } catch {
                throw new Error('Gagal mengunduh bukti pendaftaran');
            }
        } else {
            throw new Error(error.response?.data?.statusMessage || 'Gagal mengunduh bukti pendaftaran');
        }
    }
}

async function sendWhatsAppRegistrationProof(userId: number | string): Promise<any> {
    const api = new apiCore();
    const frontendUrl = `${window.location.protocol}//${window.location.host}`;
    return api.create(`/student/${userId}/send-whatsapp`, { frontend_url: frontendUrl }, false);
}

export { downloadRegistrationProof, sendWhatsAppRegistrationProof };
