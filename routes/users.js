const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { updateUser, getCurrentUser } = require('../controllers/userControllers');

router.get('/users/me', getCurrentUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.required(),
  }),
}), updateUser);

module.exports = router;
