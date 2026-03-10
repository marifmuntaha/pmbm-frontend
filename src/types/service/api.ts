export interface ApiResponseInterface<T> {
    status: "success" | "error";
    statusMessage: string;
    result?: T;
}

