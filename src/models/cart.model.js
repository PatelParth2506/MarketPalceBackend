'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo(models.User, { foreignKey: 'user_id' })
      Cart.belongsTo(models.Product,{ foreignKey : 'product_id' })
    }
  }
  Cart.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      user_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
      },
      product_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
      },
      quentity:{
        type:DataTypes.INTEGER,
        allowNull:false
      },
  }, {
    sequelize,
    modelName: 'Cart',
    tableName:'tbl_market_cart',
    timestamps:true
  });
  return Cart;
};