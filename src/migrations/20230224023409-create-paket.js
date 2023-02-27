'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pakets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_outlet: {
        type: Sequelize.INTEGER,
        allowNull : false,
        onDelete :  'CASCADE',
        onUpdate : 'CASCADE',
        references : {
          model : "outlets",
          key : "id",
          as : "id_outlet"
        }
      },
      jenis: {
        type: Sequelize.ENUM('kiloan','selimut','bed_cover','kaos','lain'),
        allowNull : false
      },
      nama_paket: {
        type: Sequelize.STRING,
        allowNull :false
      },
      harga: {
        type: Sequelize.INTEGER,
        allowNull : false,
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
    await queryInterface.dropTable('pakets');
  }
};