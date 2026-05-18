"use strict";

module.exports = (sequelize, DataTypes) => {
  const AboutInfoCard = sequelize.define(
    "AboutInfoCard",
    {
      cardKey: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      title: { type: DataTypes.STRING(255), allowNull: false },
      imagePath: { type: DataTypes.STRING(500), allowNull: true },
      altText: { type: DataTypes.STRING(255), allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      paragraphs: { type: DataTypes.JSON, allowNull: true },
      orderIndex: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    { tableName: "about_info_cards", underscored: true, timestamps: true }
  );
  return AboutInfoCard;
};
