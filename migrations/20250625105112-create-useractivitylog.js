'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_market_activitylLog', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId : {
      type:Sequelize.INTEGER,
    },
    method : {
      type : Sequelize.STRING,
      allowNull : false
    },
    orignalUrl : {
      type : Sequelize.STRING,
      allowNull:false
    },
    body : {
      type : Sequelize.JSON,
    },
    query : {
      type : Sequelize.JSON
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
    await queryInterface.dropTable('tbl_market_activitylLog');
  }
};