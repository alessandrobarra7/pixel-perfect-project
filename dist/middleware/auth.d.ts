import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from '../utils/jwt.js';
export interface AuthRequest extends Request {
    user?: JwtPayload;
}
export declare function authenticate(req: AuthRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export declare function authorize(...allowedRoles: string[]): (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
