const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUserAvatar,
  updateUserInfo,
  getProfile,
} = require("../controllers/users.js");
const { celebrate, Joi } = require("celebrate");
const { validateURL } = require("../utils/utils.js");

const router = express.Router();

// Rota GET para buscar todos os usuários
router.get("/", getAllUsers);

// Rota GET para buscar o perfil do usuário atual
router.get("/me", getProfile);

// Rota GET para buscar um usuário por ID
router.get(
  "/:id",
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
  getUserById
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
  updateUserInfo
);

// Rota PATCH para atualizar avatar
router.patch(
  "/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().custom(validateURL).required(),
    }),
  }),
  updateUserAvatar
);

module.exports = router;
