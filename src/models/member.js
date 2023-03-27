'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      member.hasOne(models.transaksi, {
        as : "transaksi",
        foreignKey : "id_member"
      })

    }
  }
  member.init({
    nama: DataTypes.STRING,
    alamat: DataTypes.STRING,
    jenis_kelamin: DataTypes.ENUM("laki-laki","enum"),
    tlp: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'member',
  });
  return member;
};