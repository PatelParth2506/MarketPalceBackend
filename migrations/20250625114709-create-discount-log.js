'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_market_discountLog', {
      discountLog_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      discount_id : {
        type:Sequelize.INTEGER,
        allowNull : false
      },
      startingDate:{
        type:Sequelize.DATE,
        allowNull:false
      },
      endingDate:{
        type:Sequelize.DATE,
        allowNull:false
      },
      product_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
      },
      discount:{
        type:Sequelize.INTEGER,
        allowNull:false
      },
      is_active:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:false
      },
      createdBy:{
        type:Sequelize.INTEGER,
        allowNull:false
      },
      typeOfDiscount:{
        type:Sequelize.ENUM('per','flat'),
        allowNull:false,
        defaultValue:'per'
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
    await queryInterface.dropTable('tbl_market_discountLog');
  }
};