const fs = require('fs');
const path = require('path');

const root = __dirname;
const assetsDir = path.join(root, 'assets');
const photoDir = path.join(assetsDir, 'photos');
const videoDir = path.join(assetsDir, 'videos');

const photoExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const videoExtensions = new Set(['.mp4', '.webm', '.mov', '.avi', '.m4v', '.mkv']);

const fallbackPhotos = [
  { src: 'panorama.jpg', alt: 'Zdjęcie portfolio 1' },
  { src: 'panorama.jpg', alt: 'Zdjęcie portfolio 2' },
  { src: 'panorama.jpg', alt: 'Zdjęcie portfolio 3' },
  { src: 'panorama.jpg', alt: 'Zdjęcie portfolio 4' }
];

const fallbackVideos = [
  { type: 'youtube', id: 'okjkdd6l2sw', title: 'Film dronowy 1', thumbnail: 'https://img.youtube.com/vi/okjkdd6l2sw/maxresdefault.jpg' },
  { type: 'youtube', id: 'j_L9U0Sy93U', title: 'Film dronowy 2', thumbnail: 'https://img.youtube.com/vi/j_L9U0Sy93U/maxresdefault.jpg' }
];

function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function listFilesRec(dir, allowedExtensions) {
  if (!fs.existsSync(dir)) return [];

  const files = [];
  const walk = (currentDir) => {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }

      if (!entry.isFile()) continue;

      const lower = entry.name.toLowerCase();
      const isAllowed = Array.from(allowedExtensions).some(ext => lower.endsWith(ext));
      if (isAllowed) {
        files.push(fullPath);
      }
    }
  };

  walk(dir);
  return files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function toWebPath(filePath) {
  return path.relative(root, filePath).split(path.sep).join('/');
}

function toMediaArray(files, kind) {
  return files
    .map(filePath => {
      const fileName = path.basename(filePath);
      const name = path.parse(fileName).name;
      if (kind === 'photo') {
        return { src: toWebPath(filePath), alt: `Zdjęcie ${name}` };
      }

      return {
        type: 'local',
        src: toWebPath(filePath),
        title: `Film ${name}`,
        poster: 'panorama.jpg'
      };
    });
}

ensureDirectory(photoDir);
ensureDirectory(videoDir);

const photoFiles = listFilesRec(photoDir, photoExtensions);
const videoFiles = listFilesRec(videoDir, videoExtensions);

const photos = photoFiles.length ? toMediaArray(photoFiles, 'photo') : fallbackPhotos;
const videos = videoFiles.length ? toMediaArray(videoFiles, 'video') : fallbackVideos;

const mediaData = `window.mediaData = ${JSON.stringify({ photos, videos }, null, 2)};\n`;

fs.writeFileSync(path.join(root, 'media-data.js'), mediaData, 'utf8');
console.log(`Zapisano media-data.js: ${photos.length} zdjęć, ${videos.length} elementów wideo`);
console.log('Dodawaj nowe pliki do assets/photos i assets/videos, a potem uruchom: node generate-media.js');
