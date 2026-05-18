"use strict";

module.exports = (sequelize, DataTypes) => {
  const EmailSettings = sequelize.define(
    "EmailSettings",
    {
      smtpHost: { type: DataTypes.STRING(255), allowNull: true, field: "smtp_host" },
      smtpPort: { type: DataTypes.INTEGER, allowNull: true, field: "smtp_port" },
      smtpSecure: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: true, field: "smtp_secure" },
      smtpUser: { type: DataTypes.STRING(255), allowNull: true, field: "smtp_user" },
      smtpPassword: { type: DataTypes.STRING(255), allowNull: true, field: "smtp_password" },
      fromEmail: { type: DataTypes.STRING(255), allowNull: true, field: "from_email" },
      fromName: { type: DataTypes.STRING(255), allowNull: true, field: "from_name" },
      contactFormEmail: { type: DataTypes.STRING(255), allowNull: true, field: "contact_form_email" },
    },
    {
      tableName: "email_settings",
      underscored: true,
      timestamps: true,
      updatedAt: "updated_at",
      createdAt: false,
    }
  );

  return EmailSettings;
};
