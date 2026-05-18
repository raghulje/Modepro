"use strict";

module.exports = (sequelize, DataTypes) => {
  const NavigationItem = sequelize.define(
    "NavigationItem",
    {
      label: { type: DataTypes.STRING(100), allowNull: false },
      url: { type: DataTypes.STRING(500), allowNull: true },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'navigation_items', key: 'id' }
      },
      orderIndex: { type: DataTypes.INTEGER, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      tableName: "navigation_items",
      underscored: true,
      timestamps: true,
    }
  );

  NavigationItem.associate = function (models) {
    NavigationItem.belongsTo(models.NavigationItem, { foreignKey: 'parentId', as: 'parent' });
    NavigationItem.hasMany(models.NavigationItem, { foreignKey: 'parentId', as: 'children' });
  };

  return NavigationItem;
};

