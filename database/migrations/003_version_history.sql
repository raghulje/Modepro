-- Run on existing modepro_cms databases
USE modepro_cms;

CREATE TABLE IF NOT EXISTS version_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entity_type VARCHAR(100) NOT NULL,
  entity_id INT NOT NULL,
  version_number INT NOT NULL DEFAULT 1,
  data JSON NOT NULL,
  changes TEXT,
  created_by INT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_version_entity (entity_type, entity_id),
  INDEX idx_version_created (created_at)
);
