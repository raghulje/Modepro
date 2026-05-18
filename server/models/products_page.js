"use strict";

module.exports = (sequelize, DataTypes) => {
  const ProductsPage = sequelize.define(
    "ProductsPage",
    {
      bannerImage: { type: DataTypes.STRING(500), allowNull: true },
      bannerAlt: { type: DataTypes.STRING(255), allowNull: true },
      pageTitle: { type: DataTypes.STRING(255), allowNull: true },
      introTitle: { type: DataTypes.STRING(255), allowNull: true },
      introDescription: { type: DataTypes.TEXT, allowNull: true },
    },
    { tableName: "products_page", underscored: true, timestamps: true, updatedAt: "updated_at", createdAt: false }
  );
  return ProductsPage;
};
