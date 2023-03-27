const PaketModel = require('../models').paket
const model = require('../models')
const {Op} = require('sequelize')
async function TambahPaket(req,res) {
    try {
        const payload = req.body
        const {id_outlet , jenis,nama_paket,harga} = payload

        await PaketModel.create({
            id_outlet,
            nama_paket,
            jenis,
            harga
        })
        res.json({
            status: "Success",
            msg: "berhasil tambah paket",
          });
    } catch (error) {
        res.status(403).json({
            status: "fail",
            msg: "Ada kesalahan",
            err: error,
          });
    }
}

async function getPaket (req,res) {
  const {keyword} = req.query
    try {
        const paket = await PaketModel.findAndCountAll({
            attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            include : [
                {
                    model : model.outlet,
                    require : true,
                    as : "outlet",
                    attributes : ["nama","alamat","tlp"]
                }
            ],
            where : {
              [Op.or] : [
                {
                  nama_paket : {
                    [Op.substring] : keyword
                  }
                }
              ]
            }
        })
        res.json({
            status: "Success",
            msg: "paket berhasil ditemukan",
            data : paket
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

async function deletePaket(req, res) {
    try {
      const { id } = req.params;
      const paket = await PaketModel.findByPk(id);
  
      if (paket === null) {
        res.status(403).json({
          status: "Fail",
          msg: "paket tidak ditemukan",
        });
      }
  
      await PaketModel.destroy({
        where: {
          id: id,
        },
      });
      res.json({
        status: "Success",
        msg: "paket berhasil dihapus",
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
  async function detailPaket(req, res) {
    try {
      const { id } = req.params;
      const paket = await PaketModel.findOne({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        where: {
          id: id,
        },
      });
      res.json({
        status: "Success",
        msg: "detail paket berhasil ditemukan",
        data: paket
      });
    } catch (error) {
      console.log(error);
      res.json({
        status: "Fail",
        msg: "ada kesalahan",
      });
    }
  }
  async function updatePaket(req, res) {
    try {
      const { id } = req.params;
      const payload = req.body;
      const {id_outlet , jenis,nama_paket,harga} = payload;
      const paket = await PaketModel.findByPk(id);
  
      if (paket === null) {
        res.json({
          status: "Fail",
          msg: "paket tidak ditemukan",
        });
      }
  
      await PaketModel.update(
        {
          id_outlet , jenis,nama_paket,harga
        },
        {
          where: {
            id: id,
          },
        }
      );
      res.json({
        status: "Success",
        msg: "paket berhasil diupdate",
      });
    } catch (error) {
      res.json({
        status: "Fail",
        msg: "ada kesalahan",
      });
    }
  }
module.exports = {getPaket,TambahPaket,deletePaket,detailPaket,updatePaket}