const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 5000;

// Create download directory if it doesn't exist
const downloadDir = path.join(__dirname, 'download');
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

// Middleware to parse JSON requests
app.use(express.json());

// Custom middleware to add no-cache headers
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader('X-Version', Date.now().toString() + '_9'); // Add timestamp with suffix to force refresh
  next();
});

// Serve static files from the root directory 
app.use(express.static(path.join(__dirname), {
  etag: false,
  lastModified: false
}));

// Specifically serve the index.html file for the root route
app.get('/', (req, res) => {
  // Read the file and modify it on the fly to prevent caching
  const indexPath = path.resolve(__dirname, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // Add a cache-busting timestamp to ensure fresh content
  const timestamp = Date.now();
  html = html.replace(/\?v=\d+_\d+/g, `?v=${timestamp}_9`);
  
  // Set the content type and send the modified HTML
  res.contentType('text/html');
  res.send(html);
});

// Create a route for downloading the app as a ZIP file
app.get('/download/dual-index-calculator.zip', (req, res) => {
  const zipPath = path.join(__dirname, 'download', 'dual-index-calculator.zip');
  
  // Check if the ZIP file exists
  if (fs.existsSync(zipPath)) {
    // Check if the file is newer than 1 hour
    const fileStats = fs.statSync(zipPath);
    const fileAge = Date.now() - fileStats.mtimeMs;
    const oneHour = 60 * 60 * 1000;
    
    if (fileAge < oneHour) {
      console.log('Using existing download package');
      return res.download(zipPath, 'dual-index-calculator.zip');
    }
  }
  
  // Generate a new ZIP file
  console.log('Creating new download package...');
  exec('node create-download-package.js', (error, stdout, stderr) => {
    if (error) {
      console.error('Error creating download package:', error);
      return res.status(500).send('Error generating download package');
    }
    
    console.log(stdout);
    if (stderr) {
      console.error('Stderr:', stderr);
    }
    
    // Check if the file was created successfully
    if (fs.existsSync(zipPath)) {
      res.download(zipPath, 'dual-index-calculator.zip');
    } else {
      res.status(500).send('Error generating download package');
    }
  });
});

// Handle Service Worker routes for offline capability
app.get('/service-worker.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'service-worker.js'));
});

app.get('/manifest.json', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'manifest.json'));
});

app.get('/offline.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'offline.html'));
});

// Route for test page
app.get('/test', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'test-page.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to view the application`);
  
  // Generate the initial download package
  console.log('Generating initial download package...');
  exec('node create-download-package.js', (error, stdout, stderr) => {
    if (error) {
      console.error('Error creating initial download package:', error);
      return;
    }
    
    console.log(stdout);
    if (stderr) {
      console.error('Stderr:', stderr);
    }
  });
});