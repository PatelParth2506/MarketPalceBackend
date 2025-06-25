'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tbl_market_user', [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123', // ideally hash it
        role: 'superadmin',
        mobileNo: '9999999999',
        tokenVersion: 0,
        createdBy: null,
        updatedBy: null,
        is_delete: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'user1',
        email: 'user1@example.com',
        password: 'hashedPassword123',
        role: 'user',
        mobileNo: '8888888888',
        tokenVersion: 0,
        createdBy: 1,
        updatedBy: 1,
        is_delete: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tbl_market_user', null, {});
  }
};
