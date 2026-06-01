const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.resolve(__dirname, "./prisma/dev.db");
const db = new Database(dbPath);

try {
  db.exec(`
    INSERT INTO site_settings (id, key, value, label, "group", updatedAt) 
    VALUES 
      ('setting_hero_head', 'hero_heading', 'We Build Digital Solutions That Drive Results', 'Hero Heading', 'CONTENT', CURRENT_TIMESTAMP),
      ('setting_hero_sub', 'hero_subtext', 'From stunning websites to innovative hardware projects, we deliver end-to-end solutions tailored to your business.', 'Hero Subtext', 'CONTENT', CURRENT_TIMESTAMP),
      ('setting_cta_head', 'cta_heading', 'Ready to Start Your Project?', 'CTA Heading', 'CONTENT', CURRENT_TIMESTAMP),
      ('setting_cta_sub', 'cta_subtext', 'Tell us about your vision. We will provide a personalized quote and show you exactly how we can bring it to life.', 'CTA Subtext', 'CONTENT', CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO NOTHING;
  `);
  console.log("Content settings injected successfully.");
} catch (e) {
  console.error("Failed to insert settings:", e);
}
