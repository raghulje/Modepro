"use strict";

module.exports = (sequelize, DataTypes) => {
  const HomeFeatureCard = sequelize.define(
    "HomeFeatureCard",
    {
      imagePath: { type: DataTypes.STRING(500), allowNull: true },
      images: { type: DataTypes.JSON, allowNull: true },
      title: { type: DataTypes.STRING(255), allowNull: false },
      ctaText: { type: DataTypes.STRING(100), allowNull: true },
      ctaHref: { type: DataTypes.STRING(255), allowNull: true },
      orderIndex: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    { tableName: "home_feature_cards", underscored: true, timestamps: true }
  );
  return HomeFeatureCard;
};
