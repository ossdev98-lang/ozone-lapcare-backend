'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Categories', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      description: { type: Sequelize.TEXT },
      image: { type: Sequelize.STRING },
      icon: { type: Sequelize.STRING },
      parentId: { type: Sequelize.INTEGER, references: { model: 'Categories', key: 'id' }, onDelete: 'SET NULL' },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      sortOrder: { type: Sequelize.INTEGER, defaultValue: 0 },
      metaTitle: { type: Sequelize.STRING },
      metaDescription: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('Categories'); }
};
