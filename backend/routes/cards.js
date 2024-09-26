const express = require("express");
const cardControllers = require("../controllers/cards.js");
const { celebrate, Joi } = require("celebrate");
const { validateURL } = require("../utils/utils.js");

const router = express.Router();

// Rota GET para receber todos os cards
router.get("/", cardControllers.getAllCards);

// Rota POST para criar um card
router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().custom(validateURL).required(),
    }),
  }),
  cardControllers.createCard
);

// Rota DELETE para deletar um card
router.delete(
  "/:cardId",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  cardControllers.deleteCard
);

// Rota PUT para adicionar um like
router.put(
  "/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  cardControllers.addCardLike
);

// Rota DELETE para remover um like
router.delete(
  "/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  cardControllers.removeCardLike
);

module.exports = router;
