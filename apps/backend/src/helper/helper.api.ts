export class ApiResponse<T> {
    statusCode: number;
    message: string;
    data?: T;
    meta?: Record<string, any>;
    paging?: Paging
}

export class Paging {
    page: number;
    size: number;
    total_data: number;
}

export class PageRequest {
    skip: number;
    limit: number;
}