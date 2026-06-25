'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      productId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Products', key: 'id' }, onDelete: 'CASCADE' },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
      orderId: { type: Sequelize.INTEGER, references: { model: 'Orders', key: 'id' }, onDelete: 'SET NULL' },
      rating: { type: Sequelize.INTEGER, allowNull: false },
      title: { type: Sequelize.STRING },
      body: { type: Sequelize.TEXT },
      isVerified: { type: Sequelize.BOOLEAN, defaultValue: false },
      isApproved: { type: Sequelize.BOOLEAN, defaultValue: true },
      images: { type: Sequelize.ARRAY(Sequelize.STRING), defaultValue: [] },
      helpfulCount: { type: Sequelize.INTEGER, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('Reviews'); }
};
