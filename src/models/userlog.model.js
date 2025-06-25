'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserLog extends Model {
    static associate(models) {
      
    }
  }
  UserLog.init({
   userLog_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      user_id :{
        type:DataTypes.INTEGER,
        allowNull:false
      },
      username:{
        type:DataTypes.STRING,
        allowNull:false,
      },
      email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
      },
      mobileNo:{
        type:DataTypes.STRING,
        validate:{
          len:[10]
        },
        allowNull:false
      },
      password:{
        type:DataTypes.STRING,
        allowNull:false
      },
      role:{
        type:DataTypes.ENUM('user','admin','superadmin'),
        defaultValue:'user',
        allowNull:false,
      },
      tokenVersion:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0
      },
      createdBy:{
        type:DataTypes.INTEGER
      },
      updatedBy:{
        type:DataTypes.INTEGER
      },
      is_delete:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
        allowNull:false
      },
  },{
    sequelize,
    modelName: 'UserLog',
    tableName:'tbl_market_userLog',
    timestamps:true
});
  return UserLog;
};