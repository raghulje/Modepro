"use strict";

module.exports = (sequelize, DataTypes) => {
  const Media = sequelize.define(
    "Media",
    {
      fileName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      filePath: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      fileType: {
        type: DataTypes.ENUM('image', 'document', 'svg', 'video'),
        allowNull: false,
        defaultValue: 'image',
      },
      mimeType: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      fileSize: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      altText: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      pageName: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      sectionName: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      uploadedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    },
    {
      tableName: "media",
      underscored: true,
      timestamps: true,
    }
  );

  Media.associate = function (models) {
    Media.belongsTo(models.User, { foreignKey: 'uploadedBy', as: 'uploader' });
  };

  return Media;
};

