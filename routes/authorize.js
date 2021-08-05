const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const userControllers = require('../controllers/userControllers');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
}), userControllers.login);
module.exports = router;
