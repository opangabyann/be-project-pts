const UserModel = require("../models").user;
const forgotPasswordModel = require("../models").password;
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { config } = require("dotenv");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const dayjs = require("dayjs");
const sendEmailHandle = require("../mail/indegs");

async function register(req, res) {
  try {
    const payload = req.body;
    const { nama, username, password,role } = payload;
    let hashPassword = await bcrypt.hashSync(password, 10);
    await UserModel.create({
      nama,
      username,
      password: hashPassword,
      role
    });
    res.json({
      status: "Success",
      msg: "Register berhasil",
    });
  } catch (error) {
    console.log(error)
    res.status(403).json({

      status: "fail",
      msg: "Ada kesalahan",
      err: error,
    });
  }
}

async function login(req, res) {
  try {
    const payload = req.body;

    const { username, password } = payload;

    const user = await UserModel.findOne({
      where: {
        email: username,
      },
    });

    if (user === null) {
      return res.status(422).json({
        status: "Fail",
        msg: "email tidak ditemukan, silakan register",
      });
    }

    if (password === null) {
      return res.status(422).json({
        status: "Fail",
        msg: "email dan password tidak cocok ",
      });
    }

    const verify = await bcrypt.compareSync(password, user.password);

    if (verify === false) {
      return res.status(422).json({
        status: "Fail",
        msg: "email dan password tidak cocok ",
      });
    }
    const token = jwt.sign(
      {
        id: user?.id,
        email: user?.email,
        nama: user?.nama,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.json({
      status: "Success",
      msg: "Login berhasil",
      token: token,
      user: user,
    });
  } catch (error) {
    res.status(403).json({
      status: "fail",
      msg: "Ada kesalahan",
      err: error,
    });
  }
}

module.exports = { register, login };
