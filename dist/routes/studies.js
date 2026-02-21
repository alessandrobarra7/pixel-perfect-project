import express from 'express';
import { query } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
const router = express.Router();
router.use(authenticate);
router.get('/', async (req, res, next) => {
    try {
        const { page = '1', limit = '20', patient_name, modality, study_date } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        let queryText = `
      SELECT s.*, u.name as unit_name 
      FROM studies s
      LEFT JOIN units u ON s.unit_id = u.id
      WHERE 1=1
    `;
        const params = [];
        let paramIndex = 1;
        if (patient_name) {
            queryText += ` AND s.patient_name ILIKE $${paramIndex}`;
            params.push(`%${patient_name}%`);
            paramIndex++;
        }
        if (modality) {
            queryText += ` AND s.modality = $${paramIndex}`;
            params.push(modality);
            paramIndex++;
        }
        if (study_date) {
            queryText += ` AND s.study_date = $${paramIndex}`;
            params.push(study_date);
            paramIndex++;
        }
        queryText += ` ORDER BY s.study_date DESC, s.study_time DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(parseInt(limit), offset);
        const result = await query(queryText, params);
        const countResult = await query('SELECT COUNT(*) FROM studies');
        const total = parseInt(countResult.rows[0].count);
        res.json({
            studies: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / parseInt(limit)),
            },
        });
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await query('SELECT s.*, u.name as unit_name FROM studies s LEFT JOIN units u ON s.unit_id = u.id WHERE s.id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Study not found' });
        }
        res.json({ study: result.rows[0] });
    }
    catch (error) {
        next(error);
    }
});
export default router;
//# sourceMappingURL=studies.js.map