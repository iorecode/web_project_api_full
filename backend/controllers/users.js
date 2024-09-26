const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");
const { NODE_ENV, JWT_SECRET } = process.env;

// Obtem todos os usuarios
module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (e) {
    next(new CustomError("Erro ao buscar usuários", 500));
  }
};

// Obtem usuario por ID
module.exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).orFail(() => {
      const error = new CustomError("ID não encontrado", 404);
      throw error;
    });

    res.status(200).json(user);
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      next(err);
    } else if (err.name === "CastError") {
      next(new CustomError("ID inválido fornecido", 400));
    } else {
      next(new CustomError("Erro ao buscar usuário", 500));
    }
  }
};

// Procura o email inserido, depois compara a senha hasheada com a hash salva na database
module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      const error = new Error("Senha ou e-mail incorreto");
      error.statusCode = 401;
      throw new CustomError("Senha ou e-mail incorreto", 401);
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      throw new CustomError("Senha ou e-mail incorreto", 401);
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.send({ token });
  } catch (err) {
    next(err); // Passa qualquer erro para o middleware
  }
};

// Criar um novo usuário
module.exports.createUser = async (req, res, next) => {
  try {
    const { name, about, avatar, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new CustomError("Usuário com este email já existe", 409);
    }
    const hashedPassword = await bcrypt.hash(password, 10); // Senhas sao salvas em hash + salt

    const user = new User({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });
    const newUser = await user.save();

    res.status(201).json(newUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new CustomError("Dados inválidos fornecidos", 400));
    } else {
      next(new CustomError(`Erro ao criar o usuário: ${err.message}`, 500));
    }
  }
};

// Atualiza os dados de um usuário
module.exports.updateUserInfo = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      // Ativamente usa o id do usuario atual para editar o perfil
      req.user._id, // Caso o front seja exploitado, o usuario ainda acabaria editando seu proprio perfil
      { name, about },
      { new: true }
    ).orFail(() => {
      throw new CustomError("ID não encontrado", 404);
    });
    res.status(200).json({ data: user });
  } catch (err) {
    if (err.statusCode === 404) {
      next(err);
    } else if (err.name === "CastError") {
      next(new CustomError("ID inválido fornecido", 400));
    } else if (err.name === "ValidationError") {
      next(new CustomError("Erro de validação da URL", 400));
    } else {
      next(new CustomError("Erro ao buscar o usuário", 500));
    }
  }
};

// Atualiza o avatar de um usuário
module.exports.updateUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    // Mesma ideia da ultima function
    // Separados por praticidade (tambem sao forms separados no front)
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new CustomError("Usuário não encontrado", 404);
    }

    res.status(200).json({ data: user });
  } catch (err) {
    if (err.statusCode === 404) {
      next(err);
    } else {
      next(
        new CustomError(
          "Ocorreu um erro no servidor ao atualizar o avatar",
          500
        )
      );
    }
  }
};

module.exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).orFail(() => {
      throw new CustomError("Usuário não encontrado", 404);
    });
    res.send({ data: user });
  } catch (err) {
    next(err);
  }
};
