'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_market_user', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username:{
        type:Sequelize.STRING,
        allowNull:false,
      },
      email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
      },
      password:{
        type:Sequelize.STRING,
        allowNull:false
      },
      role:{
        type:Sequelize.ENUM('user','admin','superadmin'),
        defaultValue:'user',
        allowNull:false,
      },
      createdBy:{
        type:Sequelize.INTEGER
      },
      updatedBy:{
        type:Sequelize.INTEGER
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
    await queryInterface.dropTable('tbl_market_user');
  }
};