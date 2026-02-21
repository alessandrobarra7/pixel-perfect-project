import express from 'express';
import { query } from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize('admin_master'));

router.get('/', async (req, res, next) => {
  try {
    const { page = '1', limit = '50' } = req.query;
    
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const result = await query(
      `SELECT a.*, u.email as user_email 
       FROM audit_logs a
       LEFT JOIN users u ON a.user_id = u.id
       ORDER BY a.created_at DESC
       LIMIT $1 OFFSET $2`,
      [parseInt(limit as string), offset]
    );

    const countResult = await query('SELECT COUNT(*) FROM audit_logs');
    const total = parseInt(countResult.rows[0].count);

    res.json({
      logs: result.rows,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
