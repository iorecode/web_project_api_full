const express = require("express");
const userControllers = require("../controllers/users.js");
const { celebrate, Joi } = require("celebrate");
const { validateURL } = require("../utils/utils.js");

const router = express.Router();

// Rota GET para buscar todos os usuários
router.get("/", userControllers.getAllUsers);

// Rota GET para buscar o perfil do usuário atual
router.get("/me", userControllers.getProfile);

// Rota GET para buscar um usuário por ID
router.get(
  "/:id",
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
  userControllers.getUserById
);

// Rota PATCH para atualizar dados de usuário
router.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  }),
  userControllers.updateUserInfo
);

// Rota PATCH para atualizar avatar
router.patch(
  "/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().custom(validateURL).required(),
    }),
  }),
  userControllers.updateUserAvatar
);

module.exports = router;
