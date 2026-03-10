export type GatewayType = {
    id?: number;
    provider: string;
    is_active: boolean;
    mode: number;
    server_key: string;
    client_key: string;
    secret_key: string;
    callback_token: string;
}