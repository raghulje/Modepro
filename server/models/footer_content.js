"use strict";

module.exports = (sequelize, DataTypes) => {
  const FooterContent = sequelize.define(
    "FooterContent",
    {
      officeTitle: { type: DataTypes.STRING(255), allowNull: true },
      officeText: { type: DataTypes.TEXT, allowNull: true },
      factoryTitle: { type: DataTypes.STRING(255), allowNull: true },
      factoryText: { type: DataTypes.TEXT, allowNull: true },
      careersTitle: { type: DataTypes.STRING(255), allowNull: true },
      careersDescription: { type: DataTypes.TEXT, allowNull: true },
      careersCtaText: { type: DataTypes.STRING(100), allowNull: true },
      careersCtaHref: { type: DataTypes.STRING(255), allowNull: true },
      copyrightText: { type: DataTypes.STRING(255), allowNull: true },
      managedByText: { type: DataTypes.STRING(255), allowNull: true },
      footerNavigation: { type: DataTypes.JSON, allowNull: true },
    },
    { tableName: "footer_content", underscored: true, timestamps: true, updatedAt: "updated_at", createdAt: false }
  );
  return FooterContent;
};
