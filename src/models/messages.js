'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  };
  Messages.init({
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: 'Please inser senderId!'
      }
    },
    recipientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: 'Please insert recipientId!'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: 'Please insert content!'
      }
    }
  }, {
    sequelize,
    modelName: 'Messages'
  })
  return Messages
}
