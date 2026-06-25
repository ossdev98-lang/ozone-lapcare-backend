'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      phone: { type: Sequelize.STRING },
      password: { type: Sequelize.STRING },
      role: { type: Sequelize.ENUM('ADMIN', 'CUSTOMER'), defaultValue: 'CUSTOMER' },
      status: { type: Sequelize.ENUM('active', 'inactive', 'banned'), defaultValue: 'active' },
      isEmailVerified: { type: Sequelize.BOOLEAN, defaultValue: false },
      emailVerifyToken: { type: Sequelize.STRING },
      resetPasswordToken: { type: Sequelize.STRING },
      resetPasswordExpires: { type: Sequelize.DATE },
      refreshToken: { type: Sequelize.TEXT },
      avatar: { type: Sequelize.STRING },
      googleId: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Users');
  }
};
