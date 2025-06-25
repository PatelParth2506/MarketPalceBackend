'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ErrorLog extends Model {
    static associate(models) {
      // define association here
    }
  }
  ErrorLog.init({
    stack:{
      type:DataTypes.TEXT,
      allowNull:false
    },
    message:{
      type:DataTypes.STRING,
    },
    statusCode:{
      type:DataTypes.INTEGER,
    },
    requestUrl:{
      type:DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'ErrorLog',
    tableName:'tbl_market_errorLog',
    timestamps:true,
    id:false
  });
  return ErrorLog;
};