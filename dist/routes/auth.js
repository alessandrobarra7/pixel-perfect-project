import express from 'express';
import { query } from '../config/database.js';
import { comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { authenticate } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
const router = express.Router();
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const result = await query('SELECT id, email, password_hash, role, full_name, unit_id FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = result.rows[0];
        const isValid = await comparePassword(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
            unitId: user.unit_id,
        });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        logger.info('User logged in: ' + user.email);
        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.full_name,
                role: user.role,
                unitId: user.unit_id,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/logout', authenticate, async (req, res, next) => {
    try {
        res.clearCookie('token');
        logger.info('User logged out: ' + (req.user?.email || 'unknown'));
        res.json({ message: 'Logged out successfully' });
    }
    catch (error) {
        next(error);
    }
});
router.get('/me', authenticate, async (req, res, next) => {
    try {
        const result = await query('SELECT id, email, full_name as name, role, unit_id FROM users WHERE id = $1', [req.user?.userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user: result.rows[0] });
    }
    catch (error) {
        next(error);
    }
});
export default router;
//# sourceMappingURL=auth.js.map