"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Seed to add user
     */
    await queryInterface.bulkInsert(
      "users",
      [
        {
          email: "administrator@mailinator.com",
          password: "admin",
        },
        {
          email: "pace@mailinator.com",
          password: "pace",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
