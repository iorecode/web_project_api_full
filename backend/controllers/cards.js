const { Card } = require("../models/card");
const CustomError = require("../utils/customError");

// Obter todos os cards
module.exports.getAllCards = async (req, res, next) => {
  // Tenta encontrar todas as cards na database
  try {
    const cards = await Card.find({});
    res.status(200).json({ data: cards });
    // Erro 500 no caso de um erro (assume-se que o erro foi por conta do servidor)
  } catch (e) {
    next(new CustomError("Erro ao buscar cartões", 500));
  }
};

// Criar um novo card
module.exports.createCard = async (req, res, next) => {
  // Tenta criar um cartao, assinando o nome e link inseridos pelo usuario.
  try {
    const { name, link } = req.body;
    const owner = req.user._id; // Define o proprietario do cartao como o usuario atual.
    const card = new Card({ name, link, owner }); // Cria o cartao na database com os dados anteriores
    const newCard = await card.save(); // utilizamos newCard como o save de card para garantir o documento atualizado
    res.status(201).json({ data: newCard });
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new CustomError("Dados Invalidos", 400));
    } else {
      next(new CustomError("Erro ao criar o cartão", 500));
    }
  }
};

// Deletar um card
module.exports.deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params; // Temos o ID do cartao especifico na request

    // Tentamos encotrar um cartao pelo ID especificado
    const card = await Card.findById(cardId).orFail(() => {
      const error = new CustomError(
        `Nenhum cartão encontrado com id ${cardId}`,
        404
      );
      throw error;
    });
    // Agora verificamos se o dono do cartao encontrado = usuario que tentou deleta-lo
    // No frontend tambem removeremos o botao responsavel por deletar cards, porem isso nos garante contra exploits
    if (req.user._id.toString() !== card.owner.toString()) {
      const error = new CustomError("Acesso Proibido", 403);
      throw error;
    }

    // Deletamos da database
    await Card.findByIdAndDelete(cardId);
    res.status(200).json({ message: "Cartão deletado com sucesso" });
  } catch (err) {
    if (err.statusCode === 404) {
      next(err);
    } else if (err.statusCode === 403) {
      next(err);
    } else {
      next(new CustomError("Erro ao deletar cartão", 500));
    }
  }
};

// Adicionar um like

module.exports.addCardLike = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    ).orFail(() => {
      throw new CustomError(
        `Nenhum cartão encontrado com esse id ${req.params.cardId}`,
        404
      );
    });

    res.status(200).json({ data: card });
  } catch (err) {
    if (err.statusCode === 404) {
      next(err);
    } else {
      next(new CustomError("Erro ao adicionar like", 500));
    }
  }
};

// Remover um like

module.exports.removeCardLike = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    ).orFail(() => {
      throw new CustomError(
        `Nenhum cartão encontrado com esse id ${req.params.cardId}`,
        404
      );
    });
    res.status(200).json({ data: card });
  } catch (err) {
    if (err.statusCode === 404) {
      next(err);
    } else {
      next(new CustomError("Erro ao remover like", 500));
    }
  }
};
