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
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('tbl_market_user','mobileNo')
    queryInterface.removeColumn('tbl_market_product','price')
  }
};
