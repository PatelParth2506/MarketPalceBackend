'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_market_product', {
      product_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subcategory_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'tbl_market_subcategory',
          key:"subcategory_id"
        },
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
      },
      product_title:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{
          len:[4-15]
        }
      },
     product_description: {
        type: Sequelize.STRING
      },
      price:{
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0
      },
      discountedPrice :{
        type : Sequelize.INTEGER,
        defaultValue : 0
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
    await queryInterface.dropTable('tbl_market_product');
  }
};
