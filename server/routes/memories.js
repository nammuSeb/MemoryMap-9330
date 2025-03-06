// Add to existing memories.js
import multer from 'multer';
import { authenticateToken } from '../middleware/auth.js';
import { checkNSFW } from '../services/nsfwCheck.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Update the post route to include authentication and NSFW check
router.post('/', 
  authenticateToken,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]),
  validateMemory,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let nsfwScore = 0;

      // Check uploaded image for NSFW content
      if (req.files.image) {
        nsfwScore = await checkNSFW(req.files.image[0].buffer);
        
        if (nsfwScore > 0.7) { // Threshold for NSFW content
          return res.status(400).json({ 
            message: 'Content flagged as inappropriate' 
          });
        }
      }

      const { title, description, latitude, longitude, isPublic } = req.body;
      
      const [result] = await pool.query(
        `INSERT INTO memories 
         (id, user_id, title, description, latitude, longitude, 
          image_url, video_url, is_public, nsfw_score) 
         VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.user.userId,
          title,
          description,
          latitude,
          longitude,
          req.files.image ? req.files.image[0].filename : null,
          req.files.video ? req.files.video[0].filename : null,
          isPublic,
          nsfwScore
        ]
      );

      res.status(201).json({ id: result.insertId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});