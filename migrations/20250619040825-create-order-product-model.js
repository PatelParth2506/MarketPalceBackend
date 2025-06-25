'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_market_orderProduct', {
      orderProduct_id: {
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
          key:'order_id'
        },
        onDelete:'RESTRICT',
        onUpdate:'RESTRICT'
      },
      product_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'tbl_market_product',
          key:'product_id'
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
      product_discounted_price : {
        type : Sequelize.INTEGER,
        defaultValue : 0
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