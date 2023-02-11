const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
// const config = require("config");
// const secretKey = config.get("secretKey");
const { createDir } = require("../services/fileService");
const File = require("../models/File");

class AuthController {
  async userRegistration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.errors[0].msg });
      }

      const { email, password, name } = req.body;

      const candidate = await User.findOne({ email });

      if (candidate) {
        return res
          .status(400)
          .json({ message: `User with email ${email} already exist` });
      }

      const hashPassword = await bcrypt.hash(password, 8);
      const user = new User({
        email,
        password: hashPassword,
        name,
      });
      const token = jwt.sign({ id: user.id, email }, 'secretKey', {
        expiresIn: "1h",
      });
      await user.save();
      await createDir(req, new File({ user: user.id, name: "" }));

      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          diskSpace: user.diskSpace,
          usedSpace: user.usedSpace,
        },
      });
    } catch (error) {
      console.log(error);
      res.send({ message: "Server error" });
    }
  }

  // -------------------------- //

  async userLogin(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPassValid = bcrypt.compareSync(password, user.password);

      if (!isPassValid) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const token = jwt.sign({ id: user.id, email }, 'secretKey', {
        expiresIn: "1h",
      });

      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          diskSpace: user.diskSpace,
          usedSpace: user.usedSpace,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      console.log(error);
      res.send({ message: "Server error" });
    }
  }

  // -------------------------- //

  async checkAuth(req, res) {
    try {
      const user = await User.findOne({
        id: req.user.id,
        email: req.user.email,
      });
      const token = jwt.sign({ id: user.id, email: user.email }, 'secretKey', {
        expiresIn: "1h",
      });

      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          diskSpace: user.diskSpace,
          usedSpace: user.usedSpace,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      console.log(error);
      res.send({ message: "Server error" });
    }
  }
}

module.exports = new AuthController();
