import express from 'express';
import { query } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
const router = express.Router();
router.use(authenticate);
router.get('/by-study/:studyId', async (req, res, next) => {
    try {
        const { studyId } = req.params;
        const result = await query('SELECT * FROM reports WHERE study_id = $1 ORDER BY created_at DESC LIMIT 1', [studyId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }
        res.json({ report: result.rows[0] });
    }
    catch (error) {
        next(error);
    }
});
router.post('/', async (req, res, next) => {
    try {
        const { study_id, content, status } = req.body;
        const user_id = req.user?.userId;
        if (!study_id || !content) {
            return res.status(400).json({ error: 'Study ID and content are required' });
        }
        const existingReport = await query('SELECT id FROM reports WHERE study_id = $1', [study_id]);
        let result;
        if (existingReport.rows.length > 0) {
            result = await query('UPDATE reports SET content = $1, status = $2, updated_at = NOW() WHERE study_id = $3 RETURNING *', [content, status || 'draft', study_id]);
        }
        else {
            result = await query('INSERT INTO reports (study_id, user_id, content, status) VALUES ($1, $2, $3, $4) RETURNING *', [study_id, user_id, content, status || 'draft']);
        }
        res.json({ report: result.rows[0] });
    }
    catch (error) {
        next(error);
    }
});
export default router;
//# sourceMappingURL=reports.js.map