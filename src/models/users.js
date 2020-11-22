'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  };
  Users.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notNull: 'Please insert your name!'
      }
    },
    phoneNumber: {
      type: DataTypes.INTEGER,
      validate: {
        notNull: 'Please insert your number!'
      }
    },
    avatar: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users'
  })
  return Users
}
