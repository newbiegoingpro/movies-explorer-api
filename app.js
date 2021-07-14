const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const cors = require('cors');
require('dotenv').config();

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const userRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const blankRouter = require('./routes/blank');
const userControllers = require('./controllers/userControllers');
const auth = require('./middlewares/auth');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://nick.mestoapp.nomoredomains.club',
    'http://nick.mestoapp.nomoredomains.club',
  ],
  credentials: true,
}));
mongoose.connect('mongodb://localhost:27017/testDiplomaDB', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
app.use(requestLogger);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
}), userControllers.login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
}), userControllers.createUser);
app.use(auth);
app.use('/', userRouter);
app.use('/', moviesRouter);
app.use('/', blankRouter);
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`${PORT}`);
});
