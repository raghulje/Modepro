"use strict";

module.exports = (sequelize, DataTypes) => {
  const ActivityLog = sequelize.define(
    "ActivityLog",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "users", key: "id" },
      },
      action: { type: DataTypes.STRING(100), allowNull: false },
      entityType: { type: DataTypes.STRING(100), allowNull: true },
      entityId: { type: DataTypes.INTEGER, allowNull: true },
      details: { type: DataTypes.JSON, allowNull: true },
      ipAddress: { type: DataTypes.STRING(45), allowNull: true },
    },
    {
      tableName: "activity_logs",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  ActivityLog.associate = function (models) {
    ActivityLog.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };

  return ActivityLog;
};
