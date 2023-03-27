const dayjs = require("dayjs");
const { sequelize } = require("../models");
const model = require("../models");
const TransaksiModel = require("../models").transaksi;
const DetailModel = require("../models").detail_transaksi;
const excel = require('exceljs');
async function getTransaksi(req, res) {
  try {
    const transaksi = await TransaksiModel.findAll({
      where : {
        id_outlet : req.id_outlet
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
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
    });
    console.log(req.id_outlet)
    res.json({
      status: "Success",
      msg: "Transaksi berhasil ditemukan",
      data: transaksi,
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

async function TambahTransaksi(req, res) {
  try {
    const payload = req.body;
    const {
      id_outlet,
      kode_invoice,
      id_member,
      biaya_tambahan,
      diskon,
      pajak,
      qty,
      id_paket,
      keterangan,
      id_user,
    } = payload;
    const db_transaction = await sequelize.transaction();
    const { id } = await TransaksiModel.create({
      id_outlet,
      kode_invoice,
      id_member,
      tgl: dayjs(),
      batas_waktu: dayjs().add(2, "day"),
      // tgl_bayar,
      biaya_tambahan,
      diskon,
      pajak,
      status: "baru",
      dibayar: "belum_dibayar",
      id_user: req.id,
    });
    await DetailModel.create(
      { id_transaksi: id, id_paket, keterangan, qty },
      { transaction: db_transaction }
    );
    db_transaction.commit();
    res.json({
      status: "Success",
      msg: "berhasil tambah transaksi",
    });
  } catch (error) {
    db_transaction.rollback();
    res.status(403).json({
      status: "fail",
      msg: "Ada kesalahan",
      err: error,
    });
  }
}
async function deleteTransaksi(req, res) {
  try {
    const { id } = req.params;
    const transaksi = await TransaksiModel.findByPk(id);

    if (transaksi === null) {
      res.status(403).json({
        status: "fail",
        msg: "transaksi tidak ditemukan",
      });
    }

    await TransaksiModel.destroy({
      where: {
        id: id,
      },
    });
    res.json({
      status: "Success",
      msg: "transaksi berhasil dihapus",
    });
  } catch (error) {
    res.status(403).json({
      status: "fail",
      msg: "Ada kesalahan",
      err: error,
    });
  }
}

async function detailTransaksi(req, res) {
  try {
    const { id } = req.params;
    const transaksi = await TransaksiModel.findOne({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: {
        id: id,
      },
    });
    res.json({
      status: "Success",
      msg: "detail transaksi berhasil ditemukan",
      data: transaksi,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Fail",
      msg: "ada kesalahan",
    });
  }
}
async function updateTransaksi(req, res) {
  try {
    const { id } = req.params;
    const payload = req.body;
    const {
      id_outlet,
      kode_invoice,
      id_member,
      tgl,
      tgl_bayar,
      batas_waktu,
      biaya_tambahan,
      diskon,
      pajak,
      status,
      dibayar,
      id_user,
    } = payload;
    const transaksi = await TransaksiModel.findByPk(id);

    if (transaksi === null) {
      res.json({
        status: "Fail",
        msg: "transaksi tidak ditemukan",
      });
    }

    await TransaksiModel.update(
      {
        tgl_bayar,
        status,
        dibayar,
      },
      {
        where: {
          id: id,
        },
      }
    );
    res.json({
      status: "Success",
      msg: "transaksi berhasil diupdate",
    });
  } catch (error) {
    res.json({
      status: "Fail",
      msg: "ada kesalahan",
    });
  }
}

async function downloadRekap(req, res) {
  try {
    const transaksi = await DetailModel.findAll({
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
              attributes: ["nama", "alamat", "jenis_kelamin","tlp"],
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
    // console.log(transaksi.member.nama)

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Laporan Transaksi");
    worksheet.columns = [
      { header: "No.", key: "no", width: 10 },
      { header: "Kode Invoice", key: "invoice", width: 25 },
      { header: "Nama Member", key: "nama", width: 25 },
      { header: "Alamat Member", key: "alamat", width: 25 },
      { header: "Telephone Member", key: "telephone", width: 25 },
      { header: "Jenis Cucian", key: "jenis", width: 25 },
      { header: "Berat Cucian", key: "qty", width: 25 },
      { header: "Total Bayar", key: "total", width: 25 },
      { header: "Status Paket", key: "status", width: 25 },
      { header: "Status Pembayaran", key: "dibayar", width: 25 },
    ];
    transaksi.forEach((item, index) => {
      worksheet.addRow({
        no: index + 1,
        invoice: item.transaksi.kode_invoice,
        nama: item.transaksi.member.nama,
        alamat: item.transaksi.member.alamat,
        telephone: item.transaksi.member.tlp,
        jenis: item.paket.jenis,
        qty: item.qty,
        total: item.paket.harga,
        status: item.transaksi.status,
        dibayar: item.transaksi.dibayar,
      });
    });
    res.setHeader(
      "Content-type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  } catch (error) {
    console.log(error)
    res.json({
      status: "Fail",
      msg: "ada kesalahan",
    });
  }
}
module.exports = {
  getTransaksi,
  TambahTransaksi,
  deleteTransaksi,
  detailTransaksi,
  updateTransaksi,
  downloadRekap,
};
