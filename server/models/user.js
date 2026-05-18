"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      fullName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM('super_admin', 'admin', 'editor', 'viewer'),
        allowNull: false,
        defaultValue: 'editor',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      permissions: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null,
        comment: 'Custom permissions that override role-based defaults. Format: { page: { view: bool, edit: bool, delete: bool } }'
      },
    },
    {
      tableName: "users",
      underscored: true,
      timestamps: true,
    }
  );

  User.associate = function (models) {
    User.hasMany(models.Media, { foreignKey: 'uploadedBy', as: 'uploadedMedia' });
    User.hasMany(models.ActivityLog, { foreignKey: 'userId', as: 'activityLogs' });
    User.hasMany(models.LoginHistory, { foreignKey: 'userId', as: 'loginHistory' });
  };

  return User;
};

