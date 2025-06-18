'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Subcategory,{ foreignKey: 'category_id',sourceKey:"id" })
    }
  }
  Category.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      title:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
          len:[5-15]
        }
      },
      description:{
        type:DataTypes.STRING,
        allowNull:false
      },
      image_path:{
        type:DataTypes.STRING,
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
    modelName: 'Category',
    tableName:'tbl_market_category',
    timestamps:true
  });
  return Category;
};