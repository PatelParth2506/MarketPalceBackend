'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderProductLog extends Model {
    static associate(models) {
      // define association here
    }
  }
  OrderProductLog.init({
    orderProductLog_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      orderProduct_id : {
        type : DataTypes.INTEGER,
        allowNull : false
      },
      order_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
      },
      product_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
      },
      product_name:{
        type:DataTypes.STRING,
        allowNull:false
      },
      product_price : {
        type:DataTypes.INTEGER,
        allowNull:false
      },
      product_discounted_price:{
        type:DataTypes.INTEGER,
        defaultValue:0
      },
      quentity:{
        type:DataTypes.INTEGER,
        allowNull:false
      },
  }, {
    sequelize,
    modelName: 'OrderProductLog',
    tableName : 'tbl_market_orderproductLog',
    timestamps :true,
    id : false
  });
  return OrderProductLog;
};