-- Run once if your DB was created before open_in_new_tab was added to the schema.
USE modepro_cms;

ALTER TABLE navigation_items
  ADD COLUMN open_in_new_tab TINYINT(1) NOT NULL DEFAULT 0 AFTER is_active;

-- Optional (only if media uploads fail later):
-- ALTER TABLE media ADD COLUMN page_name VARCHAR(100) NULL AFTER alt_text;
-- ALTER TABLE media ADD COLUMN section_name VARCHAR(100) NULL AFTER page_name;
