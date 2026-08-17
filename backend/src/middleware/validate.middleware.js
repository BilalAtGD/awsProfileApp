/**
 * Validation middleware factory using Joi schemas.
 * Usage: router.post('/route', validate(schema), controller)
 *
 * @param {Joi.Schema} schema — Joi schema to validate req.body against
 */
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,   // return all errors, not just first
    stripUnknown: true,  // remove fields not in schema
  });

  if (error) {
    const messages = error.details.map((d) => d.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: messages,
    });
  }

  req.body = value; // use the sanitized value
  next();
};

module.exports = { validate };
