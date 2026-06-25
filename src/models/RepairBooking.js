'use strict';
module.exports = (sequelize, DataTypes) => {
  const RepairBooking = sequelize.define('RepairBooking', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER },
    serviceId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    laptopBrand: { type: DataTypes.STRING },
    laptopModel: { type: DataTypes.STRING },
    issue: { type: DataTypes.TEXT, allowNull: false },
    preferredDate: { type: DataTypes.DATE },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled'),
      defaultValue: 'pending',
    },
    notes: { type: DataTypes.TEXT },
    estimatedCost: { type: DataTypes.DECIMAL(10, 2) },
    confirmBookingAmount: { type: DataTypes.DECIMAL(10, 2) },
    finalCost: { type: DataTypes.DECIMAL(10, 2) },
    paymentId: { type: DataTypes.STRING },
    paymentStatus: { type: DataTypes.STRING, defaultValue: 'pending' },
  });
  RepairBooking.associate = (models) => {
    RepairBooking.belongsTo(models.RepairService, { foreignKey: 'serviceId', as: 'service' });
    RepairBooking.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };
  return RepairBooking;
};
