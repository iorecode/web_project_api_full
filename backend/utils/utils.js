const validator = require("validator");

module.exports.validateURL = (value, helpers) => {
  if (
    !validator.isURL(value, {
      protocols: ["http", "https"],
      require_protocol: true,
    })
  ) {
    return helpers.error("string.uri");
  }
  return value;
};
