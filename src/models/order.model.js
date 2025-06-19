'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
        Order.belongsTo(models.User,{ foreignKey : 'user_id' })
        Order.hasMany(models.OrderProduct, { foreignKey : 'order_id', sourceKey: 'id' })
        Order.belongsToMany(models.Product, { through:models.OrderProduct, foreignKey : 'order_id', otherKey : 'product_id' })
    }
  }
  Order.init({
    id:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
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
  },{
    sequelize,
    modelName: 'Order',
    tableName:'tbl_market_order',
    timestamps:true
  });
  return Order;
};