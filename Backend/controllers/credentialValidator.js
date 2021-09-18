const { body, validationResult } = require('express-validator');

const credentialsValidationRules = () => [
  body('emailId').isEmail().withMessage('Must be an email!'),
  body('passwd').isLength({ min: 5 }).withMessage('Password length should be at least 5.'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  credentialsValidationRules,
  validate,
};
