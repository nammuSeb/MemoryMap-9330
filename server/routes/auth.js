import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../db/config.js';
import jwt from 'jsonwebtoken';
import twilio from 'twilio';

const router = express.Router();
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Generate random 6-digit code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Phone number validation
const validatePhone = [
  body('phoneNumber')
    .matches(/^\+[1-9]\d{1,14}$/)
    .withMessage('Invalid phone number format. Use international format: +XXXXXXXXXX'),
];

// Request verification code
router.post('/request-code', validatePhone, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phoneNumber } = req.body;
    const verificationCode = generateVerificationCode();
    const expiresIn = new Date(Date.now() + 10 * 60000); // 10 minutes

    // Store or update user with verification code
    await pool.query(
      `INSERT INTO users (id, phone_number, verification_code, verification_expires)
       VALUES (UUID(), ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       verification_code = VALUES(verification_code),
       verification_expires = VALUES(verification_expires)`,
      [phoneNumber, verificationCode, expiresIn]
    );

    // Send SMS via Twilio
    await twilioClient.messages.create({
      body: `Your Memory App verification code is: ${verificationCode}`,
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER
    });

    res.json({ message: 'Verification code sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify code and complete authentication
router.post('/verify', validatePhone, async (req, res) => {
  try {
    const { phoneNumber, code } = req.body;

    const [users] = await pool.query(
      `SELECT * FROM users 
       WHERE phone_number = ? 
       AND verification_code = ? 
       AND verification_expires > NOW()`,
      [phoneNumber, code]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    const user = users[0];

    // Mark user as verified
    await pool.query(
      `UPDATE users 
       SET is_verified = true, 
           verification_code = NULL 
       WHERE id = ?`,
      [user.id]
    );

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, phoneNumber },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({ token, userId: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;