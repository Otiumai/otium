const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function recordAd() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    protocolTimeout: 300000
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  const framesDir = '/tmp/ad-frames-desktop';
  if (fs.existsSync(framesDir)) fs.rmSync(framesDir, { recursive: true });
  fs.mkdirSync(framesDir, { recursive: true });
  
  await page.goto('https://www.otiumapp.com/ad-video.html', { waitUntil: 'networkidle0', timeout: 30000 });
  
  const fps = 24;
  const duration = 33;
  const totalFrames = fps * duration;
  
  console.log(`Recording ${totalFrames} frames at ${fps}fps...`);
  
  for (let i = 0; i < totalFrames; i++) {
    const framePath = path.join(framesDir, `frame_${String(i).padStart(5, '0')}.png`);
    await page.screenshot({ path: framePath, type: 'png' });
    if (i % 24 === 0) console.log(`Frame ${i}/${totalFrames}`);
  }
  
  await browser.close();
  console.log('Done capturing frames');
}

recordAd().catch(e => console.error(e));
