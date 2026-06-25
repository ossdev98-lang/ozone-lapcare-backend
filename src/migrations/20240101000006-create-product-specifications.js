'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductSpecifications', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      productId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Products', key: 'id' }, onDelete: 'CASCADE' },
      groupName: { type: Sequelize.STRING },
      key: { type: Sequelize.STRING, allowNull: false },
      value: { type: Sequelize.STRING, allowNull: false },
      sortOrder: { type: Sequelize.INTEGER, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('ProductSpecifications'); }
};
