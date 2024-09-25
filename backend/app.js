const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
require("dotenv").config();
const auth = require("./middleware/auth");
const {
  login,
  createUser,
  registrationValidation,
} = require("./controllers/users");
const app = express();
const { PORT = 3000 } = process.env;
const errorManagement = require("./middleware/errorManagement");
const { requestLogger, errorLogger } = require("./middleware/logGeneration");

// Inicializa o Express
app.use(express.json());

app.use(cors());
app.options("*", cors());

// Conecta a database
const mongoDBUrl = "mongodb://localhost:27017/aroundb";
mongoose
  .connect(mongoDBUrl)
  .then(() => {
    console.log("Conectado ao MongoDB com sucesso!");
  })
  .catch((err) => {
    console.error("Erro ao conectar ao MongoDB:", err);
  });

app.use(requestLogger);

// Rota post em signin para realizar o login
app.post("/signin", registrationValidation, login);
// Rota post em signup para criar o usuario
app.post("/signup", registrationValidation, createUser);

// Rota protegida para usuarios
app.use("/users", auth, require("./routes/users"));
// Rotra protegida para os cards
app.use("/cards", auth, require("./routes/cards"));

app.use(errorLogger);

app.use(errors());

app.use(errorManagement);

// Escuta o caminho fornecido, process.env ou 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
