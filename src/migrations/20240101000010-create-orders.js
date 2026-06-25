'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      orderNumber: { type: Sequelize.STRING, unique: true },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
      addressId: { type: Sequelize.INTEGER, references: { model: 'Addresses', key: 'id' }, onDelete: 'SET NULL' },
      status: { type: Sequelize.ENUM('pending','confirmed','packed','shipped','delivered','cancelled','returned'), defaultValue: 'pending' },
      paymentMethod: { type: Sequelize.ENUM('cod','razorpay','cashfree'), defaultValue: 'cod' },
      paymentStatus: { type: Sequelize.ENUM('pending','paid','failed','refunded'), defaultValue: 'pending' },
      paymentId: { type: Sequelize.STRING },
      subtotal: { type: Sequelize.DECIMAL(10,2) },
      discount: { type: Sequelize.DECIMAL(10,2), defaultValue: 0 },
      shippingCharge: { type: Sequelize.DECIMAL(10,2), defaultValue: 0 },
      taxAmount: { type: Sequelize.DECIMAL(10,2), defaultValue: 0 },
      total: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      couponCode: { type: Sequelize.STRING },
      couponDiscount: { type: Sequelize.DECIMAL(10,2), defaultValue: 0 },
      notes: { type: Sequelize.TEXT },
      shippingAddress: { type: Sequelize.JSONB },
      trackingNumber: { type: Sequelize.STRING },
      deliveredAt: { type: Sequelize.DATE },
      cancelledAt: { type: Sequelize.DATE },
      cancelReason: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable('OrderItems', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      orderId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Orders', key: 'id' }, onDelete: 'CASCADE' },
      productId: { type: Sequelize.INTEGER, references: { model: 'Products', key: 'id' }, onDelete: 'SET NULL' },
      productName: { type: Sequelize.STRING, allowNull: false },
      productSku: { type: Sequelize.STRING },
      productImage: { type: Sequelize.STRING },
      price: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      total: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      gstPercent: { type: Sequelize.FLOAT, defaultValue: 18 },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('OrderItems');
    await queryInterface.dropTable('Orders');
  }
};
