'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transaksis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_outlet: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete :  'CASCADE',
        onUpdate : 'CASCADE',
        references : {
          model : "outlets",
          key : "id",
          as : "id_outlet"
        }
      },
      kode_invoice: {
        type: Sequelize.STRING
      },
      id_member: {
        type: Sequelize.INTEGER,
        allowNull: false,
        allowNull: false,
        onDelete :  'CASCADE',
        onUpdate : 'CASCADE',
        references : {
          model : "members",
          key : "id",
          as : "id_member"
        }
      },
      tgl: {
        type: Sequelize.DATE,
        allowNull: false,

      },
      batas_waktu: {
        type: Sequelize.DATE
      },
      tgl_bayar: {
        type: Sequelize.DATE
      },
      biaya_tambahan: {
        type: Sequelize.INTEGER
      },
      diskon: {
        type: Sequelize.DECIMAL(4,2)
      },
      pajak: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM('baru','proses','selesai','diambil')
      },
      dibayar: {
        type: Sequelize.ENUM('dibayar','belum_dibayar')
      },
      id_user: {
        type: Sequelize.INTEGER,
        onDelete :  'CASCADE',
        onUpdate : 'CASCADE',
        references : {
          model : "users",
          key : "id",
          as : "id_user"
        }
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
    await queryInterface.dropTable('transaksis');
  }
};