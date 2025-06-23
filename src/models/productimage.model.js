'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductImage extends Model {
    static associate(models) {
      ProductImage.belongsTo(models.Product, { foreignKey : 'product_id', targetKey : 'id' })
    }
  }
  ProductImage.init({
   id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
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
    modelName: 'ProductImage',
    tableName: 'tbl_market_productImage',
    timestamps: true,
  });
  return ProductImage;
};