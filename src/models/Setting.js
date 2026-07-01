'use strict';
module.exports = (sequelize, DataTypes) => {
  const Setting = sequelize.define('Setting', {
    key: { type: DataTypes.STRING, allowNull: false, unique: true, primaryKey: true },
    value: { type: DataTypes.TEXT, allowNull: false },
  }, { tableName: 'Settings' });
  Setting.associate = () => {};
  return Setting;
};
