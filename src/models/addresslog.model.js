'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AddressLog extends Model {
    static associate(models) {
      // define association here
    }
  }
  AddressLog.init({
    addressLog_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      address_id : {
        type : DataTypes.INTEGER,
        allowNull: false
      },
      user_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
      },
      pinCode:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
          len:[6]
        }
      },
      apartment:{
        type:DataTypes.STRING,
        allowNull:false
      },
      landmark:{
        type:DataTypes.STRING,
        allowNull:false
      },
      city:{
        type:DataTypes.STRING,
        allowNull:false
      },
      state:{
        type:DataTypes.STRING,
        allowNull:false
      },
      createdBy:{
        type:DataTypes.INTEGER,
        allowNull:false
      },
      updatedBy:{
        type:DataTypes.INTEGER
      },
      is_delete:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
        allowNull:false
      }      
  }, {
    sequelize,
    modelName: 'AddressLog',
    tableName : 'tbl_market_addressLog',
    timestamps : true,
    id : false
  });
  return AddressLog;
};