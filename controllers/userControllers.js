const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/Conflict');

const { NODE_ENV, JWT } = process.env;
module.exports.createUser = (req, res, next) => {
  // хешируем пароль
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .then((user) => {
      res.send({
        user: {
          avatar: user.avatar,
          name: user.name,
          about: user.about,
          email: user.email,
          _id: user._id,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      } else if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictError('Пользователь уже зарегистрирован.');
      }
      next(err);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials({ email, password })
    .then((user) => {
      console.log(NODE_ENV);
      const token = jwt.sign({ _id: user._id }, NODE_ENV !== 'production' ? 'some-secret-key' : JWT);
      res.send({ token, user });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { name: req.body.name, email: req.body.email },
    { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователя с таким Id нет');
      } else {
        return res.status(200).send(user);
      }
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      next(err);
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
  // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователя с таким Id нет');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      next(err);
    })
    .catch(next);
};
