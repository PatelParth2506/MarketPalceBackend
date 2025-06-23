'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('tbl_market_product','price',{
      type:Sequelize.INTEGER,
      allowNull:false,
      defaultValue:0
    })
    queryInterface.addColumn('tbl_market_user','mobileNo',{
      type:Sequelize.STRING,
      allowNull:false,
      defaultValue:'0000000000',
      validate:{
        len:[10]
      }
    })
    queryInterface.addColumn('tbl_market_user','tokenVersion',{
      type:Sequelize.INTEGER,
      allowNull:false,
      defaultValue:0,
    })
    queryInterface.addColumn('tbl_market_product','discountedPrice',{
      type:Sequelize.INTEGER,
      defaultValue : 0
    })
    queryInterface.addColumn('tbl_market_orderProduct','product_discounted_price',{
      type:Sequelize.INTEGER,
      defaultValue : 0
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('tbl_market_user','mobileNo')
    queryInterface.removeColumn('tbl_market_product','price')
    queryInterface.removeColumn('tbl_market_user','tokenVersion')
    queryInterface.removeColumn('tbl_market_product','discountedPrice')
    queryInterface.removeColumn('tbl_market_orderProduct','product_discounted_price')
  }
};
