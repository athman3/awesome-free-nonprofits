/**
 * Weekly check for nonprofit service URL validity.
 *
 * This script reads services.json, checks each service URL for availability,
 * and prints a summary that the GitHub Actions workflow uses to create an issue
 * when problems are detected or new offers need review.
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVICES_SOURCE_PATH = path.join(__dirname, 'services.json');
const REQUEST_TIMEOUT_MS = 15000;
const CONCURRENCY_LIMIT = 5;

/**
 * Check a single URL and return its HTTP status code.
 */
function checkUrl(url) {
  return new Promise((resolve) => {
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      resolve({ status: null, ok: false, error: 'invalid URL' });
      return;
    }
    const lib = parsed.protocol === 'https:' ? https : http;
    const req = lib.request(url, { method: 'HEAD', timeout: REQUEST_TIMEOUT_MS }, (res) => {
      // Treat 2xx and 3xx responses as reachable (redirects still mean the link is live)
      resolve({ status: res.statusCode, ok: res.statusCode < 400 });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ status: null, ok: false, error: 'timeout' });
    });

    req.on('error', (err) => {
      resolve({ status: null, ok: false, error: err.message });
    });

    req.end();
  });
}

/**
 * Run promises in chunks to respect a concurrency limit.
 */
async function runWithConcurrency(tasks, limit) {
  const results = [];
  for (let i = 0; i < tasks.length; i += limit) {
    const chunk = tasks.slice(i, i + limit);
    const chunkResults = await Promise.all(chunk.map((fn) => fn()));
    results.push(...chunkResults);
  }
  return results;
}

async function main() {
  const raw = fs.readFileSync(SERVICES_SOURCE_PATH, 'utf-8');
  const servicesData = JSON.parse(raw);
  const entries = Object.entries(servicesData);

  console.log(`🔍 Checking ${entries.length} service URLs…\n`);

  const tasks = entries.map(([name, service]) => async () => {
    const result = await checkUrl(service.url);
    const icon = result.ok ? '✅' : '❌';
    const detail = result.ok
      ? `HTTP ${result.status}`
      : result.error
        ? `Error: ${result.error}`
        : `HTTP ${result.status}`;
    console.log(`${icon} ${name}: ${detail} (${service.url})`);
    return { name, url: service.url, ...result };
  });

  const results = await runWithConcurrency(tasks, CONCURRENCY_LIMIT);

  const broken = results.filter((r) => !r.ok);

  console.log('\n--- Summary ---');
  console.log(`Total services: ${results.length}`);
  console.log(`Reachable:      ${results.length - broken.length}`);
  console.log(`Unreachable:    ${broken.length}`);

  if (broken.length > 0) {
    console.log('\n⚠️  Broken URLs detected:');
    for (const b of broken) {
      const detail = b.error ? b.error : `HTTP ${b.status}`;
      console.log(`  - ${b.name}: ${b.url} (${detail})`);
    }
    // Exit with a non-zero code so the workflow can detect failures.
    process.exit(1);
  }

  console.log('\n✅ All service URLs are reachable.');
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
