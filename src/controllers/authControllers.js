const UserModel = require("../models").user;
const model = require("../models")
const forgotPasswordModel = require("../models").password;
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { config } = require("dotenv");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const dayjs = require("dayjs");
const sendEmailHandle = require("../mail/indegs");

async function login(req, res) {
  try {
    const payload = req.body;
    const { username, password } = payload;

    const user = await UserModel.findOne({
      where: {
        username: username,
      },
      include : [
        {
            model : model.outlet,
            require : true,
            as : "outlet",
            attributes : ["nama","alamat","tlp"]
        }
    ]
    });

    if (user === null) {
      return res.status(422).json({
        status: "Fail",
        msg: "username tidak ditemukan",
      });
    }
    if (password === null) {
      return res.status(422).json({
        status: "Fail",
        msg: "username dan password tidak cocok ",
      });
    }

    const verify = await bcrypt.compareSync(password, user.password);

    if (verify === false) {
      return res.status(422).json({
        status: "Fail",
        msg: "username dan password tidak cocok ",
      });
    }
    const token = jwt.sign(
      {
        id: user?.id,
        nama: user?.nama,
        username: user?.username,
        id_outlet: user?.id_outlet,
        role: user?.role,
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
    console.log(error)
    res.status(403).json({
      status: "fail",
      msg: "Ada kesalahan",
      err: error,
    });
  }
}
async function authMe(req, res) {
  try {
    const username = req.username;

    const user = await UserModel.findOne({
      attributes: { exclude: ["password"] },
      where: {
        username: username,
      },
      include : [
        {
            model : model.outlet,
            require : true,
            as : "outlet",
            attributes : ["nama","alamat","tlp"]
        }
    ]
    });
    if (!user) {
      return res.status(403).json({
        status: "gagal",
        msg: "Username tidak ditemukan ",
      });
    }

    const token = await jwt.sign(
      {
        id: user?.id,
        nama: user?.nama,
        username: user?.username,
        id_outlet: user?.id_outlet,
        role: user?.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      status: "berhasil",
      msg: "Berhasil Authme",
      user: user,
      token: token,
    });
  } catch (error) {
    console.log(error);
  }
}

async function tambahUser(req, res) {
  try {
    const payload = req.body;
    const { nama, username, id_outlet,password,role } = payload;
    let hashPassword = await bcrypt.hashSync(password, 10);

      if (req.role !== "admin"){
        return res.status(403).json({
          status: "fail",
          msg: "hanya admin yang dapat menambah user",
        });
      }
      await UserModel.create({
        nama,
        username,
        id_outlet,
        password: hashPassword,
        role
      });
    // if (user.username  === user.username){
    //   return res.status(403).json({
    //     status: "fail",
    //     msg: "hanya admin yang dapat menambah user",
    //   });
    // }

      res.json({
        status: "Success",
        msg: "User berhasil ditambahkan",
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

module.exports = { tambahUser, login ,authMe }