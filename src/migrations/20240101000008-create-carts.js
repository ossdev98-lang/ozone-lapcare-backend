'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Carts', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: Sequelize.INTEGER, unique: true, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
      sessionId: { type: Sequelize.STRING },
      couponId: { type: Sequelize.INTEGER, references: { model: 'Coupons', key: 'id' }, onDelete: 'SET NULL' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable('CartItems', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      cartId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Carts', key: 'id' }, onDelete: 'CASCADE' },
      productId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Products', key: 'id' }, onDelete: 'CASCADE' },
      quantity: { type: Sequelize.INTEGER, defaultValue: 1 },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('CartItems');
    await queryInterface.dropTable('Carts');
  }
};
