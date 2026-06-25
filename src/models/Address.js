'use strict';
module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('Address', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.ENUM('home', 'work', 'other'), defaultValue: 'home' },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    line1: { type: DataTypes.STRING, allowNull: false },
    line2: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING, allowNull: false },
    state: { type: DataTypes.STRING, allowNull: false },
    pincode: { type: DataTypes.STRING, allowNull: false },
    country: { type: DataTypes.STRING, defaultValue: 'India' },
    isDefault: { type: DataTypes.BOOLEAN, defaultValue: false },
    landmark: { type: DataTypes.STRING },
  });
  Address.associate = (models) => {
    Address.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };
  return Address;
};
