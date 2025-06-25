'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_market_orderLog', {
      orderLog_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id : { 
        type : Sequelize.INTEGER,
        allowNull : false
      },
      totalPrice : {
        type:Sequelize.INTEGER,
        allowNull:false
      },
      order_status:{
        type:Sequelize.ENUM('pending','delivered','rejected'),
        allowNull:false,
      },
      user_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
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
    await queryInterface.dropTable('tbl_market_orderLog');
  }
};