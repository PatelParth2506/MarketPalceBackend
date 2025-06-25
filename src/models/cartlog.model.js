'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CartLog.init({
    cartLog_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
    cart_id : {
      type : DataTypes.INTEGER,
      allowNull : false
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
    modelName: 'CartLog',
    tableName : 'tbl_market_cartLog',
    timestamps:true
  });
  return CartLog;
};