import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../db/config.js';

const router = express.Router();

// Validation middleware
const validateMemory = [
  body('title').notEmpty().trim().escape(),
  body('description').trim().escape(),
  body('latitude').isFloat({ min: -90, max: 90 }),
  body('longitude').isFloat({ min: -180, max: 180 }),
  body('isPublic').isBoolean()
];

// Get memories near location
router.get('/nearby', async (req, res) => {
  try {
    const { latitude, longitude, radius = 1 } = req.query;
    
    const [memories] = await pool.query(
      `SELECT *, 
       (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * 
       cos(radians(longitude) - radians(?)) + sin(radians(?)) * 
       sin(radians(latitude)))) AS distance 
       FROM memories 
       HAVING distance < ? 
       ORDER BY distance`,
      [latitude, longitude, latitude, radius]
    );

    res.json(memories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new memory
router.post('/', validateMemory, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, latitude, longitude, imageUrl, videoUrl, isPublic } = req.body;
    
    const [result] = await pool.query(
      `INSERT INTO memories 
       (id, title, description, latitude, longitude, image_url, video_url, is_public) 
       VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, latitude, longitude, imageUrl, videoUrl, isPublic]
    );

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get memory by ID
router.get('/:id', async (req, res) => {
  try {
    const [memories] = await pool.query(
      'SELECT * FROM memories WHERE id = ?',
      [req.params.id]
    );

    if (memories.length === 0) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    res.json(memories[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;