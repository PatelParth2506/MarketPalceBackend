'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DiscountLog extends Model {
    static associate(models) {
      // define association here
    }
  }
  DiscountLog.init({
    discountLog_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      discount_id: {
        type : DataTypes.INTEGER,
        allowNull : false
      },
      startingDate:{
        type:DataTypes.DATE,
        allowNull:false
      },
      endingDate:{
        type:DataTypes.DATE,
        allowNull:false
      },
      product_id:{
        type:DataTypes.INTEGER,
        allowNull:false
      },
      discount:{
        type:DataTypes.INTEGER,
        allowNull:false
      },
      is_active:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false
      },
      createdBy:{
        type:DataTypes.INTEGER,
        allowNull:false
      },
      typeOfDiscount:{
        type:DataTypes.ENUM('per','flat'),
        allowNull:false,
        defaultValue:'per'
      },
  }, {
    sequelize,
    modelName: 'DiscountLog',
    tableName : 'tbl_market_discountLog',
    timestamps : true
  });
  return DiscountLog;
};