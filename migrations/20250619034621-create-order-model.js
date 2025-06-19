'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_market_order', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      references:{
        model:'tbl_market_user',
        key:'id'
      },
      onDelete:'CASCADE',
      onUpdate:'CASCADE'
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
    await queryInterface.dropTable('tbl_market_order');
  }
};