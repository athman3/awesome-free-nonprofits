/**
 * Generate sitemap.xml for the canonical directory URL.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to sitemap.xml in app/public
const PUBLIC_SITEMAP_PATH = path.join(__dirname, '..', 'app', 'public', 'sitemap.xml');
const DIST_SITEMAP_PATH = path.join(__dirname, '..', 'app', 'dist', 'sitemap.xml');

const SITE_URL = 'https://nonprofits.athman3.com/';

function generateSitemap() {
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
  </url>
</urlset>
`;

  try {
    // Update public/sitemap.xml
    fs.writeFileSync(PUBLIC_SITEMAP_PATH, xmlContent, 'utf-8');
    console.log(`✅ Updated ${PUBLIC_SITEMAP_PATH}`);

    // If dist folder exists, update dist/sitemap.xml as well
    // This is useful if the script runs after build, or if we want to ensure dist has the latest
    if (fs.existsSync(path.dirname(DIST_SITEMAP_PATH))) {
       fs.writeFileSync(DIST_SITEMAP_PATH, xmlContent, 'utf-8');
       console.log(`✅ Updated ${DIST_SITEMAP_PATH}`);
    }

  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();

