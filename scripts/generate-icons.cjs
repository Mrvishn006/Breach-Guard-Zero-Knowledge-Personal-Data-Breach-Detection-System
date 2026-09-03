const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { app, BrowserWindow } = require('electron');

const rootDir = path.resolve(__dirname, '..');
const brandingDir = path.join(rootDir, 'src', 'assets', 'branding');
const buildIconsDir = path.join(rootDir, 'build', 'icons');
const installerDir = path.join(rootDir, 'installer');

if (!fs.existsSync(brandingDir)) fs.mkdirSync(brandingDir, { recursive: true });
if (!fs.existsSync(buildIconsDir)) fs.mkdirSync(buildIconsDir, { recursive: true });
if (!fs.existsSync(installerDir)) fs.mkdirSync(installerDir, { recursive: true });

const svgPath = path.join(brandingDir, 'breachguard-icon.svg');
const svgContent = fs.readFileSync(svgPath, 'utf8');

// Helper to assemble standard multi-resolution Windows .ICO binary from PNG buffers
function createIcoFromPngs(pngBuffers) {
  // pngBuffers: array of { width, height, buffer }
  const count = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + (count * dirEntrySize);

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = ICO type
  header.writeUInt16LE(count, 4); // count of images

  const entries = [];
  for (const item of pngBuffers) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(item.width >= 256 ? 0 : item.width, 0);
    entry.writeUInt8(item.height >= 256 ? 0 : item.height, 1);
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bit count (32-bit RGBA)
    entry.writeUInt32LE(item.buffer.length, 8); // size of image data
    entry.writeUInt32LE(offset, 12); // offset to image data

    offset += item.buffer.length;
    entries.push(entry);
  }

  return Buffer.concat([header, ...entries, ...pngBuffers.map(p => p.buffer)]);
}

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 800,
    height: 800,
    show: false,
    webPreferences: {
      offscreen: true,
      contextIsolation: false
    }
  });

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: transparent; overflow: hidden; display: flex; align-items: center; justify-content: center; }
          #container { width: 512px; height: 512px; display: flex; align-items: center; justify-content: center; }
          svg { width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        <div id="container">
          ${svgContent}
        </div>
        <canvas id="canvas"></canvas>
      </body>
    </html>
  `;

  await win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));

  // Render various resolutions
  const targetSizes = [16, 24, 32, 48, 64, 128, 256, 512];
  const pngBuffers = [];

  for (const size of targetSizes) {
    const script = `
      (function() {
        const canvas = document.getElementById('canvas');
        canvas.width = ${size};
        canvas.height = ${size};
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, ${size}, ${size});
        
        const svgElement = document.querySelector('svg');
        const svgString = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const URL = window.URL || window.webkitURL || window;
        const blobURL = URL.createObjectURL(svgBlob);
        
        const img = new Image();
        return new Promise((resolve) => {
          img.onload = () => {
            ctx.drawImage(img, 0, 0, ${size}, ${size});
            URL.revokeObjectURL(blobURL);
            resolve(canvas.toDataURL('image/png'));
          };
          img.src = blobURL;
        });
      })()
    `;

    const dataUrl = await win.webContents.executeJavaScript(script);
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    if (size === 256) {
      fs.writeFileSync(path.join(brandingDir, 'breachguard-icon.png'), buffer);
      fs.writeFileSync(path.join(brandingDir, 'breachguard-logo.png'), buffer);
      console.log('Saved 256x256 breachguard-icon.png');
    }
    if (size === 512) {
      fs.writeFileSync(path.join(brandingDir, 'breachguard-icon-512.png'), buffer);
      console.log('Saved 512x512 breachguard-icon-512.png');
    }

    if (size <= 256) {
      pngBuffers.push({ width: size, height: size, buffer });
    }
  }

  // Create multi-resolution .ICO binary
  const icoBuffer = createIcoFromPngs(pngBuffers);
  fs.writeFileSync(path.join(buildIconsDir, 'breachguard.ico'), icoBuffer);
  fs.writeFileSync(path.join(installerDir, 'breachguard.ico'), icoBuffer);
  fs.writeFileSync(path.join(brandingDir, 'breachguard.ico'), icoBuffer);
  console.log(`Successfully generated Windows multi-resolution ICO (${icoBuffer.length} bytes)`);

  app.quit();
});
