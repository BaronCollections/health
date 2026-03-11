const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

let browser;

async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
  }
  return browser;
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'poster-service' });
});

// Render poster from HTML template + data
app.post('/render', async (req, res) => {
  try {
    const { html, width = 1080, height = 1920, format = 'png' } = req.body;

    if (!html) {
      return res.status(400).json({ error: 'html content is required' });
    }

    const b = await getBrowser();
    const page = await b.newPage();
    await page.setViewport({ width, height });
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const buffer = await page.screenshot({
      type: format,
      fullPage: false,
      ...(format === 'png' ? {} : { quality: 90 }),
    });

    await page.close();

    res.set('Content-Type', `image/${format}`);
    res.send(buffer);
  } catch (error) {
    console.error('Render error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Render poster to PDF
app.post('/render/pdf', async (req, res) => {
  try {
    const { html } = req.body;

    const b = await getBrowser();
    const page = await b.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const buffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
    });

    await page.close();

    res.set('Content-Type', 'application/pdf');
    res.send(buffer);
  } catch (error) {
    console.error('PDF render error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Poster service running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  if (browser) await browser.close();
  process.exit(0);
});
