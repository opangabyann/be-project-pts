"use strict";
const { Model } = require("sequelize");
const transaksi = require("./transaksi");
module.exports = (sequelize, DataTypes) => {
  class detail_transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      detail_transaksi.belongsTo(models.transaksi, {
        as: "transaksi",
        foreignKey: "id_transaksi",
      });
      detail_transaksi.belongsTo(models.paket, {
        as: "paket",
        foreignKey: "id_paket",
      });
    }
  }
  detail_transaksi.init(
    {
      id_transaksi: DataTypes.INTEGER,
      id_paket: DataTypes.INTEGER,
      qty: DataTypes.DECIMAL,
      keterangan: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "detail_transaksi",
    }
  );
  return detail_transaksi;
};
