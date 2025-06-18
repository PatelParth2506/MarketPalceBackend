'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subcategory extends Model {
    static associate(models) {
      Subcategory.belongsTo(models.Category,{ foreignKey:'category_id' })
      Subcategory.hasMany(models.Product, { foreignKey:'subcategory_id', sourceKey:'id' })
    }
  }
  Subcategory.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull:false,
      },
      subcategory_title: {
        type: DataTypes.STRING,
        allowNull:false
      },
      subcategory_description: {
        type: DataTypes.STRING
      },
      subcategory_image_path: {
        type: DataTypes.STRING,
        allowNull:false
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
    modelName: 'Subcategory',
    tableName:'tbl_market_subcategory',
    timestamps:true
  });
  return Subcategory;
};