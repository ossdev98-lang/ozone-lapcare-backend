'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Addresses', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
      type: { type: Sequelize.ENUM('home', 'work', 'other'), defaultValue: 'home' },
      name: { type: Sequelize.STRING, allowNull: false },
      phone: { type: Sequelize.STRING, allowNull: false },
      line1: { type: Sequelize.STRING, allowNull: false },
      line2: { type: Sequelize.STRING },
      city: { type: Sequelize.STRING, allowNull: false },
      state: { type: Sequelize.STRING, allowNull: false },
      pincode: { type: Sequelize.STRING, allowNull: false },
      country: { type: Sequelize.STRING, defaultValue: 'India' },
      isDefault: { type: Sequelize.BOOLEAN, defaultValue: false },
      landmark: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('Addresses'); }
};
