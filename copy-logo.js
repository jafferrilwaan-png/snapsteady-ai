import fs from 'fs';
import path from 'path';

const src = 'C:/Users/jaffer rilwaan.v/.gemini/antigravity/brain/5c657984-a37c-4d39-b98c-f9621cddfabd/.user_uploaded/media_1788890166613.webp';
const dest = './public/iqoo-hackathon-logo.webp';

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  const data = fs.readFileSync(dest);
  const b64 = `data:image/webp;base64,${data.toString('base64')}`;
  fs.writeFileSync('./src/assets/logo.js', `export const IQOO_LOGO = "${b64}";\n`);
  console.log('Logo copied and base64 exported successfully.');
} else {
  console.log('Source not found:', src);
}
