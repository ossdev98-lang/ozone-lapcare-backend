'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    type: { type: DataTypes.ENUM('order', 'promotion', 'system', 'review'), defaultValue: 'system' },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
    link: { type: DataTypes.STRING },
    data: { type: DataTypes.JSONB },
  });
  Notification.associate = (models) => {
    Notification.belongsTo(models.User, { foreignKey: 'userId' });
  };
  return Notification;
};
