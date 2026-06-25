'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RepairServices', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      price: { type: Sequelize.DECIMAL(10,2) },
      priceType: { type: Sequelize.ENUM('fixed','starting_from','contact'), defaultValue: 'starting_from' },
      estimatedDays: { type: Sequelize.INTEGER },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      icon: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable('RepairBookings', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: Sequelize.INTEGER, references: { model: 'Users', key: 'id' }, onDelete: 'SET NULL' },
      serviceId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'RepairServices', key: 'id' }, onDelete: 'CASCADE' },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false },
      phone: { type: Sequelize.STRING, allowNull: false },
      laptopBrand: { type: Sequelize.STRING },
      laptopModel: { type: Sequelize.STRING },
      issue: { type: Sequelize.TEXT, allowNull: false },
      preferredDate: { type: Sequelize.DATE },
      status: { type: Sequelize.ENUM('pending','confirmed','in_progress','completed','cancelled'), defaultValue: 'pending' },
      notes: { type: Sequelize.TEXT },
      estimatedCost: { type: Sequelize.DECIMAL(10,2) },
      finalCost: { type: Sequelize.DECIMAL(10,2) },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('RepairBookings');
    await queryInterface.dropTable('RepairServices');
  }
};
