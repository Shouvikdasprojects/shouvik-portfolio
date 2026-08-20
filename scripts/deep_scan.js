const http = require('http');

const routes = [
  '/',
  '/about',
  '/projects',
  '/projects/otaku-insider',
  '/projects/anispectra',
  '/projects/ani-media-online',
  '/projects/anime-nation-india',
  '/projects/aniotakumedia',
  '/resume',
  '/socials',
  '/articles',
  '/articles/ultimate-guide-next-gen-vr-headsets-2026',
  '/articles/apple-unveils-ultra-thin-macbook-pro-m5',
  '/uploads',
  '/contact',
  '/search?q=three',
  '/privacy',
  '/terms',
  '/manifest.webmanifest',
  '/sitemap.xml',
  '/robots.txt'
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkRouteWithRetry(route, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await new Promise((resolve, reject) => {
        const req = http.get('http://localhost:3000' + route, { timeout: 10000 }, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            resolve({
              route,
              statusCode: res.statusCode,
              length: data.length,
              hasError: res.statusCode !== 200 && res.statusCode !== 307 && res.statusCode !== 308,
            });
          });
        });
        req.on('error', reject);
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('Timeout'));
        });
      });
      return res;
    } catch (err) {
      if (i === retries - 1) {
        return { route, statusCode: 'ERR', error: err.message, hasError: true };
      }
      await sleep(1000);
    }
  }
}

async function run() {
  console.log('--- STARTING ACCURATE ROUTE SCAN ---');
  let failures = [];
  for (const r of routes) {
    const res = await checkRouteWithRetry(r);
    if (res.hasError) {
      console.error(`❌ [FAIL] ${r} -> Status: ${res.statusCode} (${res.error || 'Non-200'})`);
      failures.push(res);
    } else {
      console.log(`✅ [OK] ${r} -> Status: ${res.statusCode} (${res.length} bytes)`);
    }
    await sleep(200);
  }
  console.log('--- SCAN COMPLETE ---');
  console.log(`Total: ${routes.length}, Success: ${routes.length - failures.length}, Failures: ${failures.length}`);
}

run();
