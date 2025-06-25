'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderLog extends Model {
    static associate(models) {
      // define association here
    }
  }
  OrderLog.init({
    orderLog_id:{
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    order_id : {
      type : DataTypes.INTEGER,
      allowNull : false
    },
    totalPrice : {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    order_status:{
      type:DataTypes.ENUM('pending','delivered','rejected'),
      allowNull:false,
    },
    user_id:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
  }, {
    sequelize,
    modelName: 'OrderLog',
    tableName : 'tbl_market_orderLog',
    timestamps : true
  });
  return OrderLog;
};