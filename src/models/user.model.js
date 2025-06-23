'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Cart,{ foreignKey : 'user_id', sourceKey: 'id' })
      User.hasMany(models.Address,{ foreignKey : 'user_id', sourceKey: 'id' })
      User.hasMany(models.Session, { foreignKey : 'user_id', sourceKey : 'id' })
    }
  }
  User.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
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
  }, {
    sequelize,
    modelName: 'User',
    tableName:'tbl_market_user',
    timestamps:true
  });
  return User;
};