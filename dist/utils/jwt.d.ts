export interface JwtPayload {
    userId: number;
    email: string;
    role: string;
    unitId?: number;
}
export declare function signToken(payload: JwtPayload): string;
export declare function verifyToken(token: string): JwtPayload;
