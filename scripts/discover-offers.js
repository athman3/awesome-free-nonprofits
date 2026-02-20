/**
 * Weekly discovery of new nonprofit offers.
 *
 * This script reads a curated list of candidate services (candidates.json),
 * skips any already tracked in services.json, checks whether each candidate
 * URL is reachable, and prints a report of new potential offers found.
 *
 * Exit codes:
 *   0 – no new reachable candidates found (or all already tracked)
 *   2 – one or more new reachable candidates were found (triggers issue creation)
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVICES_PATH = path.join(__dirname, 'services.json');
const CANDIDATES_PATH = path.join(__dirname, 'candidates.json');
const REQUEST_TIMEOUT_MS = 15000;
const CONCURRENCY_LIMIT = 5;

/**
 * Check a single URL for reachability (HEAD request).
 */
function checkUrl(url) {
  return new Promise((resolve) => {
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      resolve({ ok: false, status: null, error: 'invalid URL' });
      return;
    }

    const lib = parsed.protocol === 'https:' ? https : http;
    const req = lib.request(url, { method: 'HEAD', timeout: REQUEST_TIMEOUT_MS }, (res) => {
      // 2xx and 3xx mean the nonprofit page exists
      resolve({ ok: res.statusCode < 400, status: res.statusCode });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ ok: false, status: null, error: 'timeout' });
    });

    req.on('error', (err) => {
      resolve({ ok: false, status: null, error: err.message });
    });

    req.end();
  });
}

/**
 * Run async task factories in chunks to limit concurrency.
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
  // Load already-tracked service names (case-insensitive comparison)
  const trackedRaw = fs.readFileSync(SERVICES_PATH, 'utf-8');
  const trackedData = JSON.parse(trackedRaw);
  const trackedNames = new Set(
    Object.keys(trackedData).map((n) => n.toLowerCase())
  );

  // Load candidates
  const candidatesRaw = fs.readFileSync(CANDIDATES_PATH, 'utf-8');
  const candidates = JSON.parse(candidatesRaw);

  // Filter out already-tracked candidates
  const newCandidates = candidates.filter(
    (c) => !trackedNames.has(c.name.toLowerCase())
  );

  if (newCandidates.length === 0) {
    console.log('✅ All candidates are already tracked in services.json.');
    process.exit(0);
  }

  console.log(`🔍 Checking ${newCandidates.length} new candidate(s) for nonprofit offers…\n`);

  const tasks = newCandidates.map((candidate) => async () => {
    const result = await checkUrl(candidate.url);
    const icon = result.ok ? '🆕' : '⏳';
    const detail = result.ok
      ? `HTTP ${result.status} – reachable`
      : result.error
        ? `unreachable (${result.error})`
        : `HTTP ${result.status}`;
    console.log(`${icon} ${candidate.name}: ${detail}`);
    console.log(`   URL: ${candidate.url}`);
    console.log(`   About: ${candidate.about}`);
    console.log(`   Categories: ${candidate.categories.join(', ')}\n`);
    return { ...candidate, ...result };
  });

  const results = await runWithConcurrency(tasks, CONCURRENCY_LIMIT);
  const found = results.filter((r) => r.ok);

  console.log('--- Summary ---');
  console.log(`Candidates checked:  ${results.length}`);
  console.log(`New offers found:    ${found.length}`);
  console.log(`Unreachable / skip:  ${results.length - found.length}`);

  if (found.length > 0) {
    console.log('\n🆕 New potential nonprofit offers to review:');
    for (const f of found) {
      console.log(`  • ${f.name} – ${f.url}`);
      console.log(`    ${f.about}`);
    }
    // Exit 2 signals "new offers found" to the workflow
    process.exit(2);
  }

  console.log('\n✅ No new reachable offers found this week.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
