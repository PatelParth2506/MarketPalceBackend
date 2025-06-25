'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_market_cartLog', {
      cartLog_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cart_id : {
        type : Sequelize.INTEGER,
        allowNull : false
      },
      user_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
      },
      product_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
      },
      quentity:{
        type:Sequelize.INTEGER,
        allowNull:false
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
    await queryInterface.dropTable('tbl_market_cartLog');
  }
};