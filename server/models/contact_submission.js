"use strict";

module.exports = (sequelize, DataTypes) => {
  const ContactSubmission = sequelize.define(
    "ContactSubmission",
    {
      name: { type: DataTypes.STRING(255), allowNull: false },
      company: { type: DataTypes.STRING(255), allowNull: true },
      email: { type: DataTypes.STRING(255), allowNull: false },
      mobile: { type: DataTypes.STRING(50), allowNull: true },
      city: { type: DataTypes.STRING(255), allowNull: true },
      product: { type: DataTypes.STRING(255), allowNull: true },
      message: { type: DataTypes.TEXT, allowNull: true },
      source: { type: DataTypes.STRING(100), allowNull: true },
      metadata: { type: DataTypes.JSON, allowNull: true },
    },
    { tableName: "contact_submissions", underscored: true, timestamps: true, updatedAt: false }
  );
  return ContactSubmission;
};
