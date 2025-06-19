'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_market_orderProduct', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'tbl_market_order',
          key:'id'
        },
        onDelete:'RESTRICT',
        onUpdate:'RESTRICT'
      },
      product_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'tbl_market_product',
          key:'id'
        }, 
        onDelete:'RESTRICT',
        onUpdate:'RESTRICT'
      },
      product_name:{
        type:Sequelize.STRING,
        allowNull:false
      },
      product_price : {
        type:Sequelize.INTEGER,
        allowNull:false
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
    await queryInterface.dropTable('tbl_market_orderProduct');
  }
};