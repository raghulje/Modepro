"use strict";

module.exports = (sequelize, DataTypes) => {
  const HeroSlide = sequelize.define(
    "HeroSlide",
    {
      imagePath: { type: DataTypes.STRING(500), allowNull: false },
      altText: { type: DataTypes.STRING(255), allowNull: true },
      orderIndex: { type: DataTypes.INTEGER, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    { tableName: "hero_slides", underscored: true, timestamps: true }
  );
  return HeroSlide;
};
