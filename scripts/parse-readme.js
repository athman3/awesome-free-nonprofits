/**
 * Parse README.md and generate services.json for the React app
 * 
 * This script reads the awesome list from README.md, extracts services
 * with their categories, and generates a JSON file for consumption by
 * the React application.
 * 
 * Supports the awesome standard format: - [Service Name](link) - Description.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const README_PATH = path.join(__dirname, '..', 'README.md');
const OUTPUT_PATH = path.join(__dirname, '..', 'app', 'src', 'data', 'services.json');
const LOGOS_DIR = path.join(__dirname, '..', 'app', 'public', 'logos');

/**
 * Sanitize service name to create logo filename
 * Converts "Service Name" to "service-name.png"
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
 * Parse the README.md file and extract services
 */
function parseReadme() {
  try {
    const content = fs.readFileSync(README_PATH, 'utf-8');
    const services = [];
    const categories = [];
    
    // Split content by lines
    const lines = content.split('\n');
    let currentCategory = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Detect category headers (## Category Name)
      // Skip Contents, Contributing, Eligibility, and Footnotes sections
      if (line.startsWith('## ') && 
          !line.includes('Contents') && 
          !line.includes('Contributing') && 
          !line.includes('Eligibility') && 
          !line.includes('Footnotes')) {
        currentCategory = line.replace('## ', '').trim();
        if (!categories.includes(currentCategory)) {
          categories.push(currentCategory);
        }
        continue;
      }
      
      // Detect service entries in awesome format: - [Service Name](url) - Description.
      // This regex matches: - [Service Name](url) - Description
      const serviceMatch = line.match(/^-\s+\[([^\]]+)\]\(([^)]+)\)\s+-\s+(.+)$/);
      if (serviceMatch && currentCategory) {
        const serviceName = serviceMatch[1].trim();
        const serviceUrl = serviceMatch[2].trim();
        let rawDescription = serviceMatch[3].trim();
        let score = 50; // Default score

        // Extract score from hidden comment if present: <!-- score: 99 -->
        const scoreMatch = rawDescription.match(/<!--\s*score:\s*(\d+)\s*-->/);
        if (scoreMatch) {
          score = parseInt(scoreMatch[1], 10);
          // Remove the score comment from description
          rawDescription = rawDescription.replace(scoreMatch[0], '').trim();
        }

        let description = rawDescription;
        
        // Remove trailing period if present (we'll add it back consistently)
        if (description.endsWith('.')) {
          description = description.slice(0, -1);
        }
        
        // Try to split description into "about" and "offer" parts
        // Look for patterns like "Service type. Offer details." or similar
        // For now, we'll use the full description for both about and offer
        // but try to extract a shorter "about" if possible
        
        // Simple heuristic: if description has multiple sentences, 
        // first sentence might be "about", rest is "offer"
        const sentences = description.split(/\.\s+/).filter(s => s.trim().length > 0);
        
        let about = '';
        let offer = '';
        
        if (sentences.length > 1) {
          // First sentence as "about" (what the service is)
          about = sentences[0].trim();
          // Rest as "offer" (what's available for nonprofits)
          offer = sentences.slice(1).join('. ').trim();
          // Add back the period
          if (offer && !offer.endsWith('.')) {
            offer += '.';
          }
          if (about && !about.endsWith('.')) {
            about += '.';
          }
        } else {
          // Single sentence or no clear split - use full description for both
          about = description;
          offer = description;
          if (!about.endsWith('.')) {
            about += '.';
          }
          if (!offer.endsWith('.')) {
            offer += '.';
          }
        }
        
        // Check if service already exists (multi-category support)
        const existingService = services.find(s => s.name === serviceName);
        
        if (existingService) {
          // Add category if not already present
          if (!existingService.categories.includes(currentCategory)) {
            existingService.categories.push(currentCategory);
          }
          // Update about and offer if they exist and are not already set
          if (about && !existingService.about) {
            existingService.about = about;
          }
          if (offer && !existingService.offer) {
            existingService.offer = offer;
          }
          // Update score if the new one is higher or explicitly set (optional logic, here we just take the latest found)
          existingService.score = score;
          // Add logo path if not already set and logo file exists
          if (!existingService.logo) {
            const logoPath = getLogoPath(serviceName);
            if (logoPath) {
              existingService.logo = logoPath;
            }
          }
        } else {
          // Create new service entry
          const newService = {
            name: serviceName,
            url: serviceUrl,
            description: offer || about || description, // Use offer as description for backward compatibility
            score: score,
            categories: [currentCategory]
          };
          
          // Add about and offer
          if (about) {
            newService.about = about;
          }
          if (offer) {
            newService.offer = offer;
          }
          
          // Add logo path if logo file exists
          const logoPath = getLogoPath(serviceName);
          if (logoPath) {
            newService.logo = logoPath;
          }
          
          services.push(newService);
        }
      }
    }
    
    return {
      services,
      categories,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error parsing README.md:', error);
    throw error;
  }
}

/**
 * Write the parsed data to JSON file
 */
function writeJson(data) {
  try {
    // Ensure the output directory exists
    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write the JSON file
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ Successfully generated services.json with ${data.services.length} services and ${data.categories.length} categories`);
  } catch (error) {
    console.error('Error writing JSON file:', error);
    throw error;
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🔄 Parsing README.md...');
  const data = parseReadme();
  
  console.log(`📊 Found ${data.services.length} services in ${data.categories.length} categories`);
  
  console.log('💾 Writing services.json...');
  writeJson(data);
  
  console.log('✨ Done!');
}

// Run the script
main();
