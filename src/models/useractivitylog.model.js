'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Useractivitylog extends Model {
    static associate(models) {
      // define association here
    }
  }
  Useractivitylog.init({
    userId : {
      type:DataTypes.INTEGER,
    },
    method : {
      type : DataTypes.STRING,
      allowNull : false
    },
    orignalUrl : {
      type : DataTypes.STRING,
      allowNull:false
    },
    body : {
      type : DataTypes.JSON,
    },
    query : {
      type : DataTypes.JSON
    }
  }, {
    sequelize,
    modelName: 'Userctivitylog',
    tableName : 'tbl_market_activitylLog',
    timestamps:true
  });
  return Useractivitylog;
};