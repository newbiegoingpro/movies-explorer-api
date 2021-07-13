const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { updateUser, getCurrentUser } = require('../controllers/userControllers');

const method = (value) => {
  const result = validator.isEmail(value);
  if (result) {
    return value;
  }
  throw new Error('Email validation err');
};

router.get('/users/me', getCurrentUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.required().custom(method),
  }),
}), updateUser);

module.exports = router;
