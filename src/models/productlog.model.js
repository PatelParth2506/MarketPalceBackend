'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductLog extends Model {
    static associate(models) {
      // define association here
    }
  }
  ProductLog.init({
    productLog_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      product_id : {
        type:DataTypes.INTEGER,
        allowNull:false
      },
      subcategory_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
      },
      product_title:{
        type:DataTypes.STRING,
        allowNull:false,
      },
     product_description: {
        type: DataTypes.STRING
      },
      price:{
        type:DataTypes.INTEGER,
        allowNull:false
      },
      discountedPrice:{
        type:DataTypes.INTEGER,
        defaultValue:0
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
    modelName: 'ProductLog',
    tableName : 'tbl_market_productLog',
    timestamps:true,
    id:false
  });
  return ProductLog;
};