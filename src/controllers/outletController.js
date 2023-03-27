// const { sequelize } = require("../models");

const OutletModel = require("../models").outlet;
const {Op} = require('sequelize')

async function getOutlet(req, res) {
  const {keyword,page,pageSize,offset} = req.query
  try {
    const outlet = await OutletModel.findAndCountAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where : {
        [Op.or] : [
          {
            nama : {
              [Op.substring] : keyword
            },
          },
          {
            alamat : {
              [Op.substring] : keyword
            },
          }
        ]
      },
      limit : pageSize,
      offset : offset
    });

    res.json({
      status: "Success",
      msg: "outlet outlet berhasil ditemukan",
      pagination : {
        currentPage : page,
        pageSize : pageSize,
        totalData : outlet.count
      },
      data: outlet,
    });
  } catch (err) {
    console.log(err)
    res.status(403).json({
      status: "fail",
      msg: "Ada kesalahan",
      err: err,
    });
  }
}

async function tambahOutlet(req, res) {
  try {
    const payload = req.body;
    const { nama, alamat, tlp } = payload;

    if (req.role != "admin") {
      return res.status(403).json({
        status: "fail",
        msg: "hanya admin yang bisa menambah outlet",
      });
    }
    if (req.role === "admin") {
      await OutletModel.create({
        nama,
        alamat,
        tlp,
      });
      res.json({
        status: "Success",
        msg: "berhasil tambah outlet",
      });
    }
  } catch (error) {
    res.status(403).json({
      status: "fail",
      msg: "Ada kesalahan",
      err: error,
    });
  }
}

async function deleteOutlet(req, res) {
  try {
    const { id } = req.params;
    const outlet = await OutletModel.findByPk(id);

    if (outlet === null) {
      res.status(403).json({
        status: "Fail",
        msg: "outlet tidak ditemukan",
      });
    }

    await OutletModel.destroy({
      where: {
        id: id,
      },
    });
    res.json({
      status: "Success",
      msg: "outlet berhasil dihapus",
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "fail",
      msg: "Ada kesalahan",
      err: error,
    });
  }
}

async function detailOutlet(req, res) {
  try {
    const { id } = req.params;
    const outlet = await OutletModel.findOne({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: {
        id: id,
      },
    });
    res.json({
      status: "Success",
      msg: "detail outlet berhasil ditemukan",
      data: outlet,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Fail",
      msg: "ada kesalahan",
    });
  }
}
async function updateOutlet(req, res) {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { nama, alamat, tlp } = payload;
    const outlet = await OutletModel.findByPk(id);

    if (outlet === null) {
      res.json({
        status: "Fail",
        msg: "outlet tidak ditemukan",
      });
    }

    await OutletModel.update(
      {
        nama,
        alamat,
        tlp,
      },
      {
        where: {
          id: id,
        },
      }
    );
    res.json({
      status: "Success",
      msg: "outlet berhasil diupdate",
    });
  } catch (error) {
    res.json({
      status: "Fail",
      msg: "ada kesalahan",
    });
  }
}
module.exports = {
  tambahOutlet,
  getOutlet,
  deleteOutlet,
  updateOutlet,
  detailOutlet,
};
