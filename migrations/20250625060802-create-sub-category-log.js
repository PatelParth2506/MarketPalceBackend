'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_market_subcategoryLog', {
      subcategoryLog_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subcategory_id:{
        type:Sequelize.INTEGER,
        allowNull:false
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
      },
      subcategory_title: {
        type: Sequelize.STRING,
        allowNull:false
      },
      subcategory_description: {
        type: Sequelize.STRING
      },
      subcategory_image_path: {
        type: Sequelize.STRING,
        allowNull:false
      },
      createdBy:{
        type:Sequelize.INTEGER,
        allowNull:false
      },
      updatedBy:{
        type:Sequelize.STRING
      },
      is_delete:{
        type:Sequelize.BOOLEAN,
        defaultValue:false,
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
    await queryInterface.dropTable('tbl_market_subcategoryLog');
  }
};