const jwt = require("jsonwebtoken");
const { JWT_SECRET = "chave-secreta" } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Autorização necessária" });
  }
  const token = authorization.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // caso contrário, um erro ocorrerá
    return res.status(401).send({ message: "Autorização necessária" });
  }
  req.user = payload;

  next();
};
