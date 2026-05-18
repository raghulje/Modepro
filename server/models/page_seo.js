"use strict";

module.exports = (sequelize, DataTypes) => {
  const PageSeo = sequelize.define(
    "PageSeo",
    {
      pageSlug: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      metaTitle: { type: DataTypes.STRING(255), allowNull: true },
    },
    { tableName: "page_seo", underscored: true, timestamps: true }
  );
  return PageSeo;
};
