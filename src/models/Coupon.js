'use strict';
module.exports = (sequelize, DataTypes) => {
  const Coupon = sequelize.define('Coupon', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    type: { type: DataTypes.ENUM('percentage', 'fixed'), defaultValue: 'percentage' },
    value: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    minOrderAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    maxDiscount: { type: DataTypes.DECIMAL(10, 2) },
    usageLimit: { type: DataTypes.INTEGER },
    usedCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    userLimit: { type: DataTypes.INTEGER, defaultValue: 1 },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    startsAt: { type: DataTypes.DATE },
    expiresAt: { type: DataTypes.DATE },
    description: { type: DataTypes.STRING },
  });
  return Coupon;
};
