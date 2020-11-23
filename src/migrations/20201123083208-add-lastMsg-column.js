'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Messages', 'lastMsg', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Messages', 'lastMsg')
  }
}
