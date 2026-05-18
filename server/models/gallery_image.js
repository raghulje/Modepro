"use strict";

module.exports = (sequelize, DataTypes) => {
  const GalleryImage = sequelize.define(
    "GalleryImage",
    {
      thumbPath: { type: DataTypes.STRING(500), allowNull: false },
      fullPath: { type: DataTypes.STRING(500), allowNull: false },
      orderIndex: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    { tableName: "gallery_images", underscored: true, timestamps: false }
  );
  return GalleryImage;
};
