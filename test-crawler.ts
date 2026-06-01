import fs from 'fs';
import path from 'path';

async function testFetch(url: string) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
      },
      cache: 'no-store'
    });
    console.log(`URL: ${url} -> Status: ${res.status}`);
    const text = await res.text();
    fs.writeFileSync(path.join(__dirname, `raw-${url.replace(/[^a-zA-Z0-9]/g, '_')}.html`), text.slice(0, 100000));
    console.log(`Saved first 100KB to raw-${url.replace(/[^a-zA-Z0-9]/g, '_')}.html`);
    
    // Test match
    if (url.includes('youtube')) {
      const subMatch = text.match(/"label":"([0-9.,]+\s*subscribers?|[0-9.,]+[K|M|B]?\s*subscribers?)"/i) || 
                       text.match(/"text":"([0-9.,]+[K|M|B]?\s*subscribers?)"/i) ||
                       text.match(/([0-9.,]+[K|M|B]?)\s+subscribers/i);
      console.log(`YT subMatch:`, subMatch ? subMatch[0] : 'NULL');
    } else if (url.includes('instagram')) {
      const ogDescMatch = text.match(/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/i);
      console.log(`IG ogDescMatch:`, ogDescMatch ? ogDescMatch[0] : 'NULL');
      console.log(`IG Title:`, text.match(/<title>([^<]+)<\/title>/i)?.[0]);
    } else if (url.includes('facebook')) {
      const ogDescMatch = text.match(/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/i);
      console.log(`FB ogDescMatch:`, ogDescMatch ? ogDescMatch[0] : 'NULL');
      console.log(`FB Title:`, text.match(/<title>([^<]+)<\/title>/i)?.[0]);
    }
  } catch (err: any) {
    console.error(`Error for ${url}:`, err.message);
  }
}

async function main() {
  await testFetch('https://www.youtube.com/@shouvikdasvlogss');
  await testFetch('https://www.instagram.com/shouvik_das_official/');
  await testFetch('https://www.facebook.com/shouvikdascanvas/');
}

main();
