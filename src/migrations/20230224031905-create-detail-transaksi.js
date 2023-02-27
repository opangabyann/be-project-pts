'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('detail_transaksis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_transaksi: {
        type: Sequelize.INTEGER,
        onDelete :  'CASCADE',
        onUpdate : 'CASCADE',
        references : {
          model : "transaksis",
          key : "id",
          as : "id_transaksi"
        }
      },
      id_paket: {
        type: Sequelize.INTEGER,
        onDelete :  'CASCADE',
        onUpdate : 'CASCADE',
        references : {
          model : "pakets",
          key : "id",
          as : "id_pakets"
        }
      },
      qty: {
        type: Sequelize.DECIMAL
      },
      keterangan: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('detail_transaksis');
  }
};