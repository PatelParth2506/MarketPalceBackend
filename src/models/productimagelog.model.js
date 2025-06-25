'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductImageLog extends Model {
    static associate(models) {
      // define association here
    }
  }
  ProductImageLog.init({
    productImageLog_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      productimage_id : {
        type:DataTypes.INTEGER,
        allowNull:false
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image_name : {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4, 100]
        }
      },
      image_type :{
        type: DataTypes.STRING,
        allowNull: false,
      },
      image_path: {
        type: DataTypes.STRING,
        allowNull: false
      },
  }, {
    sequelize,
    modelName: 'ProductImageLog',
    tableName:'tbl_market_productImageLog',
    timestamps:true,
    id:false
  });
  return ProductImageLog;
};