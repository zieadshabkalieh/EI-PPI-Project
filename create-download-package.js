/**
 * Script to create a downloadable ZIP package of the Environmental, Practicality, and Performance Index (EPPI)(EI & PPI)
 * This creates a ZIP file containing all necessary files for offline use
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Create downloads directory if it doesn't exist
const downloadDir = path.join(__dirname, 'download');
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

// Path to the output zip file
const outputPath = path.join(downloadDir, 'dual-index-calculator.zip');

// Create a file to stream archive data to
const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level
});

// Listen for all archive data to be written
output.on('close', function() {
  console.log(`Created downloadable package (${archive.pointer()} bytes)`);
  console.log(`Package available at: ${outputPath}`);
});

// Handle warnings during archiving
archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    console.warn('Warning during archiving:', err);
  } else {
    throw err;
  }
});

// Handle errors during archiving
archive.on('error', function(err) {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Files and directories to include in the ZIP
const filesToInclude = [
  'index.html',
  'offline.html',
  'manifest.json',
  'service-worker.js',
  'styles.css',
  'styles-dropdown.css',
  'styles-radio.css',
  'styles-reagent.css',
  'mobile-responsive.css',
  'tab-watermarks.css',
  'animations.css',
  'analytical-animations.css',
  'web-renderer.js',
  'generated-icon.png'
];

// Directories to include recursively
const dirsToInclude = [
  'src',
  'vendors'
];

// Add individual files to the archive
filesToInclude.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    archive.file(filePath, { name: file });
  } else {
    console.warn(`Warning: ${file} not found, skipping`);
  }
});

// Add directories to the archive recursively
dirsToInclude.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    archive.directory(dirPath, dir);
  } else {
    console.warn(`Warning: ${dir} directory not found, skipping`);
  }
});

// Finalize the archive
archive.finalize();