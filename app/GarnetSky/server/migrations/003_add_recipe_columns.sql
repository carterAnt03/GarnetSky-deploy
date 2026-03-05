-- 003_add_recipe_columns.sql
-- Adds extra columns recipesController expects

ALTER TABLE recipes
  ADD COLUMN IF NOT EXISTS slug text;

ALTER TABLE recipes
  ADD COLUMN IF NOT EXISTS time text;

ALTER TABLE recipes
  ADD COLUMN IF NOT EXISTS thumb text;

ALTER TABLE recipes
  ADD COLUMN IF NOT EXISTS ingredients text[];

ALTER TABLE recipes
  ADD COLUMN IF NOT EXISTS instructions text[];
