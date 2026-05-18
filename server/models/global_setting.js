"use strict";

module.exports = (sequelize, DataTypes) => {
  const GlobalSetting = sequelize.define(
    "GlobalSetting",
    {
      settingKey: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      settingValue: { type: DataTypes.TEXT, allowNull: true },
      settingType: { type: DataTypes.STRING(50), defaultValue: 'text' },
      description: { type: DataTypes.STRING(255), allowNull: true },
    },
    {
      tableName: "global_settings",
      underscored: true,
      timestamps: true,
    }
  );

  return GlobalSetting;
};

