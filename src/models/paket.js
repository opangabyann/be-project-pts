'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class paket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      paket.belongsTo(models.outlet, {
        as : "outlet",
        foreignKey : "id_outlet"
      })
      paket.hasOne(models.detail_transaksi, {
        as : "paket",
        foreignKey : "id_paket"
      })
    }
  }
  paket.init({
    id_outlet: DataTypes.INTEGER,
    jenis: DataTypes.ENUM('kiloan','selimut','bed_cover','kaos','lain'),
    nama_paket: DataTypes.STRING,
    harga: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'paket',
  });
  return paket;
};