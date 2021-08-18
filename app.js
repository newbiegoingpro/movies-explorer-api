const express = require('express');
const { errors } = require('celebrate');
const cors = require('cors');
require('dotenv').config();

const { PORT = 3001 } = process.env;
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const userRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const blankRouter = require('./routes/blank');
const signupRouter = require('./routes/register');
const signinRouter = require('./routes/authorize');
const auth = require('./middlewares/auth');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://diplomashvayka.nomoredomains.club',
    'http://diplomashvayka.nomoredomains.club',
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
app.use('/', signupRouter);
app.use('/', signinRouter);
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
});
