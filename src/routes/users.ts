import express from 'express';
import { query } from '../config/database.js';
import { hashPassword } from '../utils/password.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', authorize('admin_master', 'unit_admin'), async (req, res, next) => {
  try {
    const result = await query(
      'SELECT id, email, name, role, unit_id, created_at FROM users ORDER BY created_at DESC'
    );

    res.json({ users: result.rows });
  } catch (error) {
    next(error);
  }
});

router.post('/', authorize('admin_master', 'unit_admin'), async (req, res, next) => {
  try {
    const { email, password, name, role, unit_id } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const passwordHash = await hashPassword(password);

    const result = await query(
      'INSERT INTO users (email, password_hash, name, role, unit_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, role, unit_id',
      [email, passwordHash, name, role, unit_id || null]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authorize('admin_master', 'unit_admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, name, role, unit_id } = req.body;

    const result = await query(
      'UPDATE users SET email = COALESCE($1, email), name = COALESCE($2, name), role = COALESCE($3, role), unit_id = COALESCE($4, unit_id) WHERE id = $5 RETURNING id, email, name, role, unit_id',
      [email, name, role, unit_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;
