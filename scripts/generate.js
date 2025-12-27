/**
 * Generate README.md and services.json from the source services.json
 * 
 * This script reads the services data and generates:
 * 1. An awesome-list compliant README.md
 * 2. A services.json for the React application
 * 
 * Single source of truth: scripts/services.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVICES_SOURCE_PATH = path.join(__dirname, 'services.json');
const README_PATH = path.join(__dirname, '..', 'README.md');
const APP_SERVICES_PATH = path.join(__dirname, '..', 'app', 'src', 'data', 'services.json');
const LOGOS_DIR = path.join(__dirname, '..', 'app', 'public', 'logos');

// Category order for README
const CATEGORY_ORDER = [
  'Infrastructure & Security',
  'Design & Creative',
  'Communication & Collaboration',
  'Marketing & CRM',
  'Productivity & Analytics',
  'Education & Training',
  'Business & Operations'
];

/**
 * Load services data from source JSON
 */
function loadServicesData() {
  try {
    const content = fs.readFileSync(SERVICES_SOURCE_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('❌ Error loading services.json:', error.message);
    throw error;
  }
}

/**
 * Sanitize service name to create logo filename
 */
function sanitizeLogoFilename(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Get logo path for a service if logo file exists
 */
function getLogoPath(serviceName) {
  const filename = `${sanitizeLogoFilename(serviceName)}.png`;
  const logoPath = path.join(LOGOS_DIR, filename);
  
  if (fs.existsSync(logoPath)) {
    return `/logos/${filename}`;
  }
  
  return null;
}

/**
 * Generate slug for category (for TOC links)
 * GitHub removes "&" completely, then converts spaces to single dashes
 * e.g., "Infrastructure & Security" → "infrastructure  security" → "infrastructure--security"
 */
function categoryToSlug(category) {
  return category
    .toLowerCase()
    .replace(/&/g, '')           // Remove & (leaves double space)
    .replace(/ /g, '-');         // Each space becomes a dash (preserves double dash)
}

/**
 * Generate README.md content
 */
function generateReadme(servicesData) {
  // Group services by category
  const servicesByCategory = {};
  
  for (const [name, service] of Object.entries(servicesData)) {
    // For README, only use the first category (primary)
    const primaryCategory = service.categories[0];
    if (!servicesByCategory[primaryCategory]) {
      servicesByCategory[primaryCategory] = [];
    }
    servicesByCategory[primaryCategory].push({
      name,
      url: service.url,
      about: service.about
    });
  }

  // Sort services alphabetically within each category
  for (const category of Object.keys(servicesByCategory)) {
    servicesByCategory[category].sort((a, b) => a.name.localeCompare(b.name));
  }

  // Build README content
  let readme = `# Awesome Free Nonprofits [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

Nonprofits often work with limited budgets, but many companies offer free or heavily discounted services to help them achieve their mission. This list compiles the best free offerings available for qualified nonprofit organizations.

## Contents

`;

  // Generate TOC
  for (const category of CATEGORY_ORDER) {
    if (servicesByCategory[category]) {
      readme += `- [${category}](#${categoryToSlug(category)})\n`;
    }
  }
  readme += `- [Eligibility](#eligibility)\n`;

  // Generate category sections
  for (const category of CATEGORY_ORDER) {
    if (!servicesByCategory[category]) continue;
    
    readme += `\n## ${category}\n\n`;
    
    for (const service of servicesByCategory[category]) {
      readme += `- [${service.name}](${service.url}) - ${service.about}\n`;
    }
  }

  // Add Eligibility section
  readme += `
## Eligibility

Most programs require proof of nonprofit status. Common requirements include:
- 501(c)(3) status in the United States
- Registered charity status in other countries
- Official nonprofit registration documents

Each service has its own eligibility requirements. Please check the specific provider's nonprofit program page for details.

## Contributing

We welcome contributions! Please see our [contribution guidelines](contributing.md) for details on how to add new services or update existing ones.

## Footnotes

[![CC0](https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/cc-zero.svg)](https://creativecommons.org/publicdomain/zero/1.0)

To the extent possible under law, the contributors have waived all copyright and related or neighboring rights to this work.

An interactive web application is available at [nonprofits.athman3.com](https://nonprofits.athman3.com) to explore these services with search and filtering functionality. The application features a modern design with dark mode support and is fully responsive.

For developers interested in contributing to the web application or running it locally: The project includes a React application built with Vite, Tailwind CSS, and shadcn/ui components. The application automatically generates from the services data. For setup and deployment instructions, please refer to [DEPLOYMENT.md](DEPLOYMENT.md).
`;

  return readme;
}

/**
 * Generate services.json for React app
 */
function generateAppServices(servicesData) {
  const services = [];
  const categoriesSet = new Set();

  for (const [name, service] of Object.entries(servicesData)) {
    const newService = {
      name,
      url: service.url,
      description: service.offer,
      about: service.about,
      offer: service.offer,
      score: service.score,
      categories: service.categories
    };

    // Add logo path if exists
    const logoPath = getLogoPath(name);
    if (logoPath) {
      newService.logo = logoPath;
    }

    services.push(newService);

    // Collect categories
    for (const cat of service.categories) {
      categoriesSet.add(cat);
    }
  }

  // Sort services by name
  services.sort((a, b) => a.name.localeCompare(b.name));

  // Sort categories by defined order
  const categories = CATEGORY_ORDER.filter(cat => categoriesSet.has(cat));

  return {
    services,
    categories,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Write README.md
 */
function writeReadme(content) {
  fs.writeFileSync(README_PATH, content, 'utf-8');
  console.log('✅ Generated README.md');
}

/**
 * Write services.json for React app
 */
function writeAppServices(data) {
  const outputDir = path.dirname(APP_SERVICES_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(APP_SERVICES_PATH, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✅ Generated app/src/data/services.json with ${data.services.length} services`);
}

/**
 * Main execution
 */
function main() {
  console.log('🔄 Loading services data...');
  const servicesData = loadServicesData();
  const serviceCount = Object.keys(servicesData).length;
  console.log(`📦 Loaded ${serviceCount} services`);

  console.log('📝 Generating README.md...');
  const readmeContent = generateReadme(servicesData);
  writeReadme(readmeContent);

  console.log('📊 Generating app services.json...');
  const appServices = generateAppServices(servicesData);
  writeAppServices(appServices);

  console.log('✨ Done!');
}

// Run the script
main();
