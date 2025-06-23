'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderProduct extends Model {
    static associate(models) {
      OrderProduct.belongsTo(models.Product, { foreignKey : 'product_id' })
      OrderProduct.belongsTo(models.Order, { foreignKey : 'order_id' })
    }
  }
  OrderProduct.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
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
    modelName: 'OrderProduct',
    tableName:'tbl_market_orderProduct',
    timestamps:true
  });
  return OrderProduct;
};