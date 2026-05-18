"use strict";

module.exports = (sequelize, DataTypes) => {
  const AboutPage = sequelize.define(
    "AboutPage",
    {
      bannerImage: { type: DataTypes.STRING(500), allowNull: true },
      bannerAlt: { type: DataTypes.STRING(255), allowNull: true },
      pageTitle: { type: DataTypes.STRING(255), allowNull: true },
      whoWeAre: { type: DataTypes.JSON, allowNull: true },
      ourPeople: { type: DataTypes.JSON, allowNull: true },
      manufacturingLocation: { type: DataTypes.JSON, allowNull: true },
    },
    { tableName: "about_page", underscored: true, timestamps: true, updatedAt: "updated_at", createdAt: false }
  );
  return AboutPage;
};
