"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("products", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(25),
      },
      name: {
        allowNull: true,
        type: Sequelize.STRING(100),
      },
      description: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      image_url: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      sku_no: {
        allowNull: true,
        type: Sequelize.STRING(50),
      },
      price: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      qty: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("products");
  },
};
