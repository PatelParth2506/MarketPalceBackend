'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_market_address', {
      address_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'tbl_market_user',
          key:'user_id'
        },
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
      },
      pinCode:{
        type:Sequelize.INTEGER,
        allowNull:false,
        validate:{
          len:[6]
        }
      },
      apartment:{
        type:Sequelize.STRING,
        allowNull:false
      },
      landmark:{
        type:Sequelize.STRING,
        allowNull:false
      },
      city:{
        type:Sequelize.STRING,
        allowNull:false
      },
      state:{
        type:Sequelize.STRING,
        allowNull:false
      },      
      createdBy:{
        type:Sequelize.INTEGER,
        allowNull:false
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
    await queryInterface.dropTable('tbl_market_address');
  }
};