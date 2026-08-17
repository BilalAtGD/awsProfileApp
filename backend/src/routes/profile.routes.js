const express = require('express');
const Joi = require('joi');
const { getProfile, updateProfile } = require('../controllers/profile.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

const router = express.Router();

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  phone: Joi.string().pattern(/^[+\d\s\-()]{7,20}$/).optional().allow('', null).messages({
    'string.pattern.base': 'Please enter a valid phone number',
  }),
  gender: Joi.string().valid('male', 'female', 'other').optional().allow(null),
  age: Joi.number().integer().min(1).max(120).optional().allow(null),
  profilePicKey: Joi.string().max(500).optional().allow(null),
});

// All profile routes require authentication
router.use(authenticate);

// GET /api/profile
router.get('/', getProfile);

// PUT /api/profile
router.put('/', validate(updateProfileSchema), updateProfile);

module.exports = router;
