'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubCategoryLog extends Model {
    static associate(models) {
      // define association here
    }
  }
  SubCategoryLog.init({
   subcategoryLog_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
      subcategory_id : {
        type:DataTypes.INTEGER,
        allowNull:false
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
    modelName:'SubCategoryLog',
    tableName: 'tbl_market_subcategoryLog',
    timestamps:true
  });
  return SubCategoryLog;
};