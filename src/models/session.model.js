'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    static associate(models) {
      Session.belongsTo(models.User, { foreignKey : 'user_id' })
    }
  }
  Session.init({
      session_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      refreshToken: {
        type: DataTypes.STRING,
        allowNull:false
      },
      user_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
          model:'tbl_market_sesssion',
          key:'user_id'
        },
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
      },
      ip_address:{
        type:DataTypes.STRING
      },
      agent:{
        type:DataTypes.STRING
      }
  }, {
    sequelize,
    modelName: 'Session',
    tableName:'tbl_market_session',
    timestamps:true,
    id:false
  });
  return Session;
};