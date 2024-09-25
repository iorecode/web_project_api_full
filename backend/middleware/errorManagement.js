module.exports = (err, req, res, next) => {
  if (err.joi) {
    // Erro de validação do Celebrate
    res.status(400).send({ message: err.joi.message });
  } else {
    const statusCode = err.statusCode || 500;
    const message = statusCode === 500 ? "Erro no servidor" : err.message;
    res.status(statusCode).send({ message });
  }
};
