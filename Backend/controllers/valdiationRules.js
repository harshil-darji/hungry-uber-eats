const { body, validationResult } = require('express-validator');

const customerRegistrationValidationRules = () => [
  body('emailId')
    .exists()
    .withMessage('Please enter email!')
    .isEmail()
    .withMessage('Must be an email!')
    .isString(),
  body('passwd')
    .exists()
    .withMessage('Please enter password!')
    .isLength({ min: 5 })
    .withMessage('Password length should be at least 5.')
    .isString(),
  body('name').exists().withMessage('Please enter name!').isString(),
  body('contactNo')
    .exists()
    .withMessage('Please enter contact no!')
    .isString(),
];

const restaurantRegistrationValidationRules = () => [
  body('emailId')
    .exists()
    .withMessage('Please enter email!')
    .isEmail()
    .withMessage('Must be an email!')
    .isString(),
  body('passwd')
    .exists()
    .withMessage('Please enter password!')
    .isLength({ min: 5 })
    .withMessage('Password length should be at least 5.')
    .isString(),
  body('name').exists().withMessage('Please enter name!').isString(),
];

const dishValidationRules = () => [
  body('name')
    .exists()
    .withMessage('Please enter dish name!')
    .isString(),
];

const orderValidationRules = () => [
  body('orderType')
    .exists()
    .withMessage('Please specify order type!')
    .isString(),
  body('orderAddress')
    .optional({ nullable: true })
    .isString(),
];

const customerAddressValidationRules = () => [
  body('address')
    .exists()
    .withMessage('Please enter address!')
    .isString(),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors
    .array()
    .map((err) => extractedErrors.push({ [err.param]: err.msg }));
  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  customerRegistrationValidationRules,
  restaurantRegistrationValidationRules,
  dishValidationRules,
  orderValidationRules,
  customerAddressValidationRules,
  validate,
};
