import express from 'express';
import { query } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
const router = express.Router();
router.use(authenticate);
router.get('/', async (req, res, next) => {
    try {
        const result = await query('SELECT * FROM report_templates ORDER BY name ASC');
        res.json({ templates: result.rows });
    }
    catch (error) {
        next(error);
    }
});
router.get('/snippets', async (req, res, next) => {
    try {
        const result = await query('SELECT * FROM report_snippets ORDER BY category, name ASC');
        res.json({ snippets: result.rows });
    }
    catch (error) {
        next(error);
    }
});
export default router;
//# sourceMappingURL=templates.js.map