"use strict";

module.exports = (sequelize, DataTypes) => {
  const ProductGroup = sequelize.define(
    "ProductGroup",
    {
      categoryId: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING(500), allowNull: false },
      orderIndex: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    { tableName: "product_groups", underscored: true, timestamps: false }
  );

  ProductGroup.associate = (models) => {
    ProductGroup.belongsTo(models.ProductCategory, { foreignKey: "categoryId", as: "category" });
    ProductGroup.hasMany(models.Product, { foreignKey: "groupId", as: "products" });
  };

  return ProductGroup;
};
