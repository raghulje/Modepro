"use strict";

module.exports = (sequelize, DataTypes) => {
  const CmsPage = sequelize.define(
    "CmsPage",
    {
      slug: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      content: { type: DataTypes.JSON, allowNull: false },
    },
    { tableName: "cms_pages", underscored: true, timestamps: true, updatedAt: "updated_at", createdAt: false }
  );
  return CmsPage;
};
