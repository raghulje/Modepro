"use strict";

module.exports = (sequelize, DataTypes) => {
  const VersionHistory = sequelize.define(
    "VersionHistory",
    {
      entityType: { type: DataTypes.STRING(100), allowNull: false },
      entityId: { type: DataTypes.INTEGER, allowNull: false },
      versionNumber: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
      data: { type: DataTypes.JSON, allowNull: false },
      changes: { type: DataTypes.TEXT, allowNull: true },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "users", key: "id" },
      },
    },
    {
      tableName: "version_history",
      underscored: true,
      timestamps: true,
      updatedAt: false,
    }
  );

  VersionHistory.associate = function (models) {
    VersionHistory.belongsTo(models.User, { foreignKey: "createdBy", as: "creator" });
  };

  return VersionHistory;
};
