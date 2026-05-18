"use strict";

module.exports = (sequelize, DataTypes) => {
  const LoginHistory = sequelize.define(
    "LoginHistory",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      ipAddress: { type: DataTypes.STRING(45), allowNull: true },
      userAgent: { type: DataTypes.TEXT, allowNull: true },
      success: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      tableName: "login_history",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  LoginHistory.associate = function (models) {
    LoginHistory.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };

  return LoginHistory;
};
