'use strict';
module.exports = (sequelize, DataTypes) => {
  const RepairService = sequelize.define('RepairService', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(10, 2) },
    priceType: { type: DataTypes.ENUM('fixed', 'starting_from', 'contact'), defaultValue: 'starting_from' },
    estimatedDays: { type: DataTypes.INTEGER },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    icon: { type: DataTypes.STRING },
  });
  RepairService.associate = (models) => {
    RepairService.hasMany(models.RepairBooking, { foreignKey: 'serviceId', as: 'bookings' });
  };
  return RepairService;
};
