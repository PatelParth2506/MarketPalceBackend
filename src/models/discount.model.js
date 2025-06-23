'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Discount extends Model {
     static associate(models) {
        Discount.belongsTo(models.Product, { foreignKey : 'product_id' })
    }
  }
  Discount.init({
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
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
    modelName: 'Discount',
    tableName: 'tbl_market_discount',
    timestamps:true
  });
  return Discount;
};