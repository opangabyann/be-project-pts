const DetailTModel = require("../models").detail_transaksi;
const model = require('../models')

async function getDetailTransaksi(req, res) {
  try {
    const { id } = req.params;
    const detail = await DetailTModel.findOne({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: {
        id_transaksi: id,
      },
      include: [
        {
          model: model.transaksi,
          as: "transaksi",
          require: true,
          attributes: [
            "id_outlet",
            "kode_invoice",
            "id_member",
            "tgl",
            "batas_waktu",
            "tgl_bayar",
            "biaya_tambahan",
            "diskon",
            "pajak",
            "status",
            "dibayar",
            "id_user",
          ],
          include : [
            {
              model: model.outlet,
              require: true,
              as: "outlet",
              attributes: ["nama", "alamat", "tlp"],
            },
            {
              model: model.member,
              require: true,
              as: "member",
              attributes: ["nama", "alamat", "jenis_kelamin"],
            },
            {
              model: model.user,
              require: true,
              as: "user",
              attributes: ["nama", "username", "role"],
            },
          ],
        },
        {
            model : model.paket,
            require : true,
            as : "paket",
            attributes: ["id_outlet", "jenis", "nama_paket","harga"],
          }
      ],
    });
    res.json({
      status: "Success",
      msg: "detail berhasil ditemukan",
      data: detail,
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

module.exports = { getDetailTransaksi };
