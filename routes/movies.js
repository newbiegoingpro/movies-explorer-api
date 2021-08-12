const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const method = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new Error('URL validation err');
};
const {
  createMovie, getMovies, deleteMovie,
} = require('../controllers/moviesControllers');

router.post('/movies', createMovie);

router.get('/movies', getMovies);

router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = router;
