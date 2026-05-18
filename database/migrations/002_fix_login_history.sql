-- No ALTER needed if login_history already has created_at (from modepro_cms_setup.sql).
-- This file documents the fix: Sequelize model now uses created_at, not login_at.
USE modepro_cms;
