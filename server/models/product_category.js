"use strict";

module.exports = (sequelize, DataTypes) => {
  const ProductCategory = sequelize.define(
    "ProductCategory",
    {
      slug: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      label: { type: DataTypes.STRING(255), allowNull: false },
      orderIndex: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    { tableName: "product_categories", underscored: true, timestamps: false }
  );

  ProductCategory.associate = (models) => {
    ProductCategory.hasMany(models.ProductGroup, { foreignKey: "categoryId", as: "groups" });
  };

  return ProductCategory;
};
