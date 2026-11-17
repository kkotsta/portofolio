import fs from 'fs';
import path from 'path';

const pubImages = path.join('public', 'images');
if (!fs.existsSync(pubImages)) fs.mkdirSync(pubImages, { recursive: true });

function copyAllImages(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'Botshol prenten') { // respect .gitignore rule
        copyAllImages(fullPath);
      }
    } else if (/\.(jpe?g|png|webp|svg|gif)$/i.test(entry.name)) {
      const dest = path.join(pubImages, entry.name);
      fs.copyFileSync(fullPath, dest);
    }
  }
}

copyAllImages('images');

// Also handle aliases if any
if (fs.existsSync(path.join(pubImages, 'cnc.jpeg')) && !fs.existsSync(path.join(pubImages, 'cnc.jpg'))) {
  fs.copyFileSync(path.join(pubImages, 'cnc.jpeg'), path.join(pubImages, 'cnc.jpg'));
}
if (fs.existsSync(path.join(pubImages, 'stapelaar.png')) && !fs.existsSync(path.join(pubImages, 'stapelaar1.png'))) {
  fs.copyFileSync(path.join(pubImages, 'stapelaar.png'), path.join(pubImages, 'stapelaar1.png'));
}
if (fs.existsSync(path.join(pubImages, 'stapelaar1.png')) && !fs.existsSync(path.join(pubImages, 'stapelaar.png'))) {
  fs.copyFileSync(path.join(pubImages, 'stapelaar1.png'), path.join(pubImages, 'stapelaar.png'));
}

console.log('Copied all project images to public/images/');
