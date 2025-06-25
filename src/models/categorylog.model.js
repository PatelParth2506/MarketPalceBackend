'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CategoryLog extends Model {
    static associate(models) {
      // define association here
    }
  }
  CategoryLog.init({
     categoryLog_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      category_id :{ 
        type:DataTypes.INTEGER,
        allowNull:false
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
    modelName: 'CategoryLog',
    tableName:'tbl_market_categoryLog',
    timestamps:true,
    id:false    
  });
  return CategoryLog;
};