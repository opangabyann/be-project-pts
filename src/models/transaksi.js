'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transaksi.hasOne(models.detail_transaksi, {
        as : "transaksi",
        foreignKey : "id_transaksi"
      })
      transaksi.belongsTo(models.outlet, {
        as : "outlet",
        foreignKey : "id_outlet"
      })
      transaksi.belongsTo(models.member, {
        as : "member",
        foreignKey : "id_member"
      })
      transaksi.belongsTo(models.user, {
        as : "user",
        foreignKey : "id_user"
      })
    }
  }
  transaksi.init({
    id_outlet: DataTypes.INTEGER,
    kode_invoice: DataTypes.STRING,
    id_member: DataTypes.INTEGER,
    tgl: DataTypes.DATE,
    batas_waktu: DataTypes.DATE,
    tgl_bayar: DataTypes.DATE,
    biaya_tambahan: DataTypes.INTEGER,
    diskon: DataTypes.DECIMAL(4,2),
    pajak: DataTypes.INTEGER,
    status: DataTypes.ENUM('baru','proses','selesai','diambil'),
    dibayar: DataTypes.ENUM('dibayar','belum_dibayar'),
    id_user: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'transaksi',
  });
  return transaksi;
};