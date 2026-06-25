'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Coupons', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      code: { type: Sequelize.STRING, allowNull: false, unique: true },
      type: { type: Sequelize.ENUM('percentage', 'fixed'), defaultValue: 'percentage' },
      value: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      minOrderAmount: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      maxDiscount: { type: Sequelize.DECIMAL(10, 2) },
      usageLimit: { type: Sequelize.INTEGER },
      usedCount: { type: Sequelize.INTEGER, defaultValue: 0 },
      userLimit: { type: Sequelize.INTEGER, defaultValue: 1 },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      startsAt: { type: Sequelize.DATE },
      expiresAt: { type: Sequelize.DATE },
      description: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('Coupons'); }
};
