const { check } = require("express-validator");

const registrationValidate = [
  check("email", "Uncorrect email").isEmail(),
  check(
    "password",
    "Password must be longer than 4"
  ).isLength({ min: 4 }),
];

module.exports = registrationValidate;
