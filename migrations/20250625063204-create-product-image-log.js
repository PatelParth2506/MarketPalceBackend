'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_market_productImageLog', {
      productImageLog_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productImage_id:{
        type:Sequelize.INTEGER,
        allowNull:false
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      image_name : {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [4, 100]
        }
      },
      image_type :{
        type: Sequelize.STRING,
        allowNull: false,
      },
      image_path: {
        type: Sequelize.STRING,
        allowNull: false
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
    await queryInterface.dropTable('tbl_market_productImageLog');
  }
};