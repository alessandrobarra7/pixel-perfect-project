import express from 'express';
import { query } from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const result = await query(
      'SELECT id, name, orthanc_url, orthanc_username, orthanc_aetitle, dicom_port, external_dicom_port, created_at FROM units ORDER BY name ASC'
    );

    res.json({ units: result.rows });
  } catch (error) {
    next(error);
  }
});

router.post('/', authorize('admin_master'), async (req, res, next) => {
  try {
    const { name, orthanc_url, orthanc_username, orthanc_password, orthanc_aetitle, dicom_port, external_dicom_port } = req.body;

    if (!name || !orthanc_url) {
      return res.status(400).json({ error: 'Name and Orthanc URL are required' });
    }

    const result = await query(
      `INSERT INTO units (name, orthanc_url, orthanc_username, orthanc_password, orthanc_aetitle, dicom_port, external_dicom_port) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, name, orthanc_url, orthanc_username, orthanc_aetitle, dicom_port, external_dicom_port`,
      [name, orthanc_url, orthanc_username || null, orthanc_password || null, orthanc_aetitle || 'ORTHANC', dicom_port || 4242, external_dicom_port || null]
    );

    res.status(201).json({ unit: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authorize('admin_master'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, orthanc_url, orthanc_username, orthanc_password, orthanc_aetitle, dicom_port, external_dicom_port } = req.body;

    const result = await query(
      `UPDATE units SET 
        name = COALESCE($1, name),
        orthanc_url = COALESCE($2, orthanc_url),
        orthanc_username = COALESCE($3, orthanc_username),
        orthanc_password = COALESCE($4, orthanc_password),
        orthanc_aetitle = COALESCE($5, orthanc_aetitle),
        dicom_port = COALESCE($6, dicom_port),
        external_dicom_port = COALESCE($7, external_dicom_port)
       WHERE id = $8
       RETURNING id, name, orthanc_url, orthanc_username, orthanc_aetitle, dicom_port, external_dicom_port`,
      [name, orthanc_url, orthanc_username, orthanc_password, orthanc_aetitle, dicom_port, external_dicom_port, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Unit not found' });
    }

    res.json({ unit: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;
