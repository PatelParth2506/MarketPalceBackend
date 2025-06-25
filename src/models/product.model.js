'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Subcategory,{ foreignKey : 'subcategory_id' })
      Product.hasMany(models.OrderProduct , { foreignKey : 'product_id', sourceKey: 'product_id' })
      Product.belongsToMany(models.Order, { through : models.OrderProduct, foreignKey : 'product_id', otherKey : 'order_id' })
      Product.hasMany(models.ProductImage, { foreignKey : 'product_id', sourceKey : 'product_id' })
      Product.hasMany(models.Discount, { foreignKey : 'product_id', sourceKey : 'product_id' })
    }
  }
  Product.init({
    product_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      subcategory_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
      },
      product_title:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
          len:[4-15]
        }
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
    modelName: 'Product',
    tableName:'tbl_market_product',
    timestamps:true,
    id:false
  });
  return Product;
};