"use strict";

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      groupId: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING(500), allowNull: false },
      casNo: { type: DataTypes.STRING(100), allowNull: true },
      imagePath: { type: DataTypes.STRING(500), allowNull: true },
      orderIndex: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    { tableName: "products", underscored: true, timestamps: false }
  );

  Product.associate = (models) => {
    Product.belongsTo(models.ProductGroup, { foreignKey: "groupId", as: "group" });
  };

  return Product;
};
