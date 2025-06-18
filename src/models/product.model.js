'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Subcategory,{ foreignKey : 'subcategory_id' })
    }
  }
  Product.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      subcategory_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
          model:'tbl_market_subcategory',
          key:"id"
        },
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
      },
      product_title:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
          len:[4-15]
        }
      },
     product_description: {
        type: DataTypes.STRING
      },
      product_image_path: {
        type: DataTypes.STRING,
        allowNull:false
      },
      price:{
        type:DataTypes.INTEGER,
        allowNull:false
      },
      createdBy:{
        type:DataTypes.INTEGER,
        allowNull:false
      },
      updatedBy:{
        type:DataTypes.STRING
      },
      is_delete:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
        allowNull:false
      },
  }, {
    sequelize,
    modelName: 'Product',
    tableName:'tbl_market_product',
    timestamps:true
  });
  return Product;
};