import { verifyToken } from '../utils/jwt.js';
import { logger } from '../utils/logger.js';
export function authenticate(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    try {
        const payload = verifyToken(token);
        req.user = payload;
        next();
    }
    catch (error) {
        logger.warn(`Invalid token: ${error}`);
        return res.status(401).json({ error: 'Invalid token' });
    }
}
export function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
}
//# sourceMappingURL=auth.js.map