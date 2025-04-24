const chromium = require('chrome-aws-lambda');

module.exports = async (req, res) => {
  const executablePath = await chromium.executablePath || '/usr/bin/chromium-browser';

  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: { width: 1080, height: 1080 },
    executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage();

  const html = `
    <html>
    <head>
      <style>
        body {
          margin: 0;
          font-family: sans-serif;
          width: 1080px;
          height: 1080px;
          position: relative;
          background: white;
        }
        .headline {
          position: absolute;
          top: 400px;
          left: 60px;
          font-size: 72px;
          font-weight: bold;
          color: #000;
        }
      </style>
    </head>
    <body>
      <div class="headline">20% OFF</div>
    </body>
    </html>
  `;

  await page.setContent(html);
  const buffer = await page.screenshot({ type: 'png' });
  await browser.close();

  res.setHeader('Content-Type', 'image/png');
  res.send(buffer);
};
