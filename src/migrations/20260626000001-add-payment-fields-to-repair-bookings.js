'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('RepairBookings', 'paymentId', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('RepairBookings', 'paymentStatus', { type: Sequelize.STRING, allowNull: true, defaultValue: 'pending' });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('RepairBookings', 'paymentId');
    await queryInterface.removeColumn('RepairBookings', 'paymentStatus');
  },
};
