interface ImportMetaEnv {
    readonly VITE_BACKEND_URL: 'http://localhost:8000/api/v1';
    readonly VITE_PREFIX_PASS: 'janganpernahberubah';
    readonly VITE_WHATSAPP_SERVICE_URL: string;
}
interface ImportMeta {
    readonly env: ImportMetaEnv;
}
