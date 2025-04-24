// Cloud-ready Puppeteer API for static image generation using Vercel + GitHub

// 1. Dependencies:
// npm install puppeteer-core chrome-aws-lambda fs-extra

const chromium = require('chrome-aws-lambda');
const fs = require('fs-extra');
const path = require('path');

module.exports = async (req, res) => {
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: { width: 1080, height: 1080 },
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage();

  const html = \`
    <html>
    <head>
      <style>
        @font-face {
          font-family: 'BrandFont';
          src: url("data:font/ttf;base64,\${fs.readFileSync(path.resolve('./fonts/BrandFont.ttf')).toString('base64')}");
        }
        body {
          margin: 0;
          font-family: 'BrandFont', sans-serif;
          width: 1080px;
          height: 1080px;
          position: relative;
          background: white;
        }
        .image {
          position: absolute;
          top: 60px;
          left: 60px;
          width: 400px;
        }
        .headline {
          position: absolute;
          top: 400px;
          left: 60px;
          font-size: 72px;
          font-weight: bold;
          color: #000;
        }
        .logo {
          position: absolute;
          bottom: 40px;
          right: 40px;
          width: 120px;
        }
      </style>
    </head>
    <body>
      <img src="data:image/png;base64,\${fs.readFileSync(path.resolve('./assets/product.png')).toString('base64')}" class="image" />
      <div class="headline">20% OFF</div>
      <img src="data:image/svg+xml;base64,\${fs.readFileSync(path.resolve('./assets/logo.svg')).toString('base64')}" class="logo" />
    </body>
    </html>
  \`;

  await page.setContent(html);
  const buffer = await page.screenshot({ type: 'png' });
  await browser.close();

  res.setHeader('Content-Type', 'image/png');
  res.send(buffer);
};
