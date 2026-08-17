const express = require('express');
const Joi = require('joi');
const { googleAuth, logout, getMe } = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate.middleware');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

const googleSchema = Joi.object({
  credential: Joi.string().required().messages({
    'any.required': 'Google credential token is required',
  }),
});

// POST /api/auth/google
router.post('/google', validate(googleSchema), googleAuth);

// POST /api/auth/logout
router.post('/logout', logout);

// GET /api/auth/me
router.get('/me', authenticate, getMe);

module.exports = router;
