import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
  unitId?: number;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
}
