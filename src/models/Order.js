'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    orderNumber: { type: DataTypes.STRING, unique: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    addressId: { type: DataTypes.INTEGER },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'returned'),
      defaultValue: 'pending',
    },
    paymentMethod: { type: DataTypes.ENUM('cod', 'razorpay', 'cashfree'), defaultValue: 'cod' },
    paymentStatus: { type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'), defaultValue: 'pending' },
    paymentId: { type: DataTypes.STRING },
    razorpayOrderId: { type: DataTypes.STRING },
    subtotal: { type: DataTypes.DECIMAL(10, 2) },
    discount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    shippingCharge: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    taxAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    couponCode: { type: DataTypes.STRING },
    couponDiscount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    notes: { type: DataTypes.TEXT },
    shippingAddress: { type: DataTypes.JSONB },
    trackingNumber: { type: DataTypes.STRING },
    deliveredAt: { type: DataTypes.DATE },
    cancelledAt: { type: DataTypes.DATE },
    cancelReason: { type: DataTypes.STRING },
  });
  Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
  };
  return Order;
};
