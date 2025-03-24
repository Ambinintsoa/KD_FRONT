export interface User {
    userId?: string;
    username?: string;
    role?: string;
    email?: string;
    token?: {
        token_access: string;
        token_refresh: string;
        expiration: string;
    };
}