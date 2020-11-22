'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Media extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  };
  Media.init({
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: 'Please insert senderId!'
      }
    },
    recivierId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: 'Please insert recivierId!'
      }
    },
    media: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: 'Please insert a media!'
      }
    }
  }, {
    sequelize,
    modelName: 'Media'
  })
  return Media
}
