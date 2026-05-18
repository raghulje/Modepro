"use strict";

module.exports = (sequelize, DataTypes) => {
  const HomeWelcome = sequelize.define(
    "HomeWelcome",
    {
      imagePath: { type: DataTypes.STRING(500), allowNull: true },
      title: { type: DataTypes.STRING(500), allowNull: true },
      titleHighlight: { type: DataTypes.STRING(255), allowNull: true },
      paragraphs: { type: DataTypes.JSON, allowNull: true },
      ctaText: { type: DataTypes.STRING(100), allowNull: true },
      ctaHref: { type: DataTypes.STRING(255), allowNull: true },
    },
    { tableName: "home_welcome", underscored: true, timestamps: true, updatedAt: "updated_at", createdAt: false }
  );
  return HomeWelcome;
};
