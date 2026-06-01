const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.resolve(__dirname, "./prisma/dev.db");
const db = new Database(dbPath);

try {
  db.exec(`
    INSERT INTO site_settings (id, key, value, label, "group", updatedAt) 
    VALUES 
      ('setting_theme', 'theme_color', '#6c5ce7', 'Accent Theme Color (Hex)', 'BRANDING', CURRENT_TIMESTAMP),
      ('setting_currency', 'currency', 'USD', 'Currency (e.g. USD, EUR)', 'BRANDING', CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO NOTHING;
  `);
  console.log("Settings injected via raw SQLite.");
} catch (e) {
  console.error("Failed to insert settings:", e);
}
