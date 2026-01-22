
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_IMAGE = path.join(__dirname, 'public', 'reengage-logo.png');
const TARGET_DIR = path.join(__dirname, 'public', 'sequence3');

// Ensure target directory exists
if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// Check source exists
if (!fs.existsSync(SOURCE_IMAGE)) {
    console.error(`Source image not found at ${SOURCE_IMAGE}`);
    process.exit(1);
}

console.log('Generating placeholder sequence frames...');

for (let i = 1; i <= 99; i++) {
    const fileName = `ezgif-frame-${String(i).padStart(3, '0')}.jpg`;
    const destPath = path.join(TARGET_DIR, fileName);
    fs.copyFileSync(SOURCE_IMAGE, destPath);
}

console.log('Created 99 placeholder frames in public/sequence3/');
