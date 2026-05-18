"use strict";

module.exports = (sequelize, DataTypes) => {
  const GalleryBannerSlide = sequelize.define(
    "GalleryBannerSlide",
    {
      imagePath: { type: DataTypes.STRING(500), allowNull: false },
      altText: { type: DataTypes.STRING(255), allowNull: true },
      orderIndex: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    { tableName: "gallery_banner_slides", underscored: true, timestamps: false }
  );
  return GalleryBannerSlide;
};
