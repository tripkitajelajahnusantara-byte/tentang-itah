const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'temp_photos', 'file dokumentasi lapangan');
const destDir = path.join(__dirname, '..', 'public', 'images');

// Ensure destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

if (!fs.existsSync(srcDir)) {
  console.error(`Source directory not found: ${srcDir}`);
  process.exit(1);
}

const files = fs.readdirSync(srcDir);
console.log(`Found ${files.length} files in temp_photos.`);

files.forEach(file => {
  const ext = path.extname(file);
  const nameWithoutExt = path.basename(file, ext);
  
  // Convert name to lowercase, replace spaces/parentheses/special chars with hyphens
  let normalizedName = nameWithoutExt
    .toLowerCase()
    .replace(/\s+/g, '-')              // Replace spaces with hyphens
    .replace(/[^a-z0-9\-]/g, '')       // Remove non-alphanumeric chars except hyphens
    .replace(/-+/g, '-')               // Collapse consecutive hyphens
    .replace(/^-+|-+$/g, '');          // Trim leading/trailing hyphens

  const destFile = `${normalizedName}${ext.toLowerCase()}`;
  const srcPath = path.join(srcDir, file);
  const destPath = path.join(destDir, destFile);

  try {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied: "${file}" -> "${destFile}"`);
  } catch (error) {
    console.error(`Failed to copy ${file}:`, error);
  }
});

console.log('Copy operation completed.');
