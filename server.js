const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const TEXT_FILE = path.join(__dirname, 'example.txt');
const RENAMED_FILE = path.join(__dirname, 'renamed.txt');

// Function to serve HTML content
function serveHtml(res, filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    }
  });
}

// Function to serve CSS files
function serveCss(res, filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(data);
    }
  });
}

// Function to read content from a text file
function readFileContent(res) {
  fs.readFile(TEXT_FILE, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(data);
    }
  });
}

// Function to write content to a text file
function writeFileContent(res, content) {
  fs.writeFile(TEXT_FILE, content, 'utf8', (err) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error writing file');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('File written successfully');
    }
  });
}

// Function to delete a file
function deleteFile(res) {
  fs.unlink(TEXT_FILE, (err) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found or could not be deleted');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('File deleted successfully');
    }
  });
}

// Function to rename a file
function renameFile(res) {
  fs.rename(TEXT_FILE, RENAMED_FILE, (err) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found or could not be renamed');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('File renamed successfully');
    }
  });
}

// Function to list all files in the directory
function listFiles(res) {
  fs.readdir(__dirname, (err, files) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error listing files');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(files.join('\n'));
    }
  });
}

// Create the server
const server = http.createServer((req, res) => {
  const url = req.url;

  if (url === '/') {
    // Serve the HTML file for the root route
    serveHtml(res, path.join(__dirname, 'index.html'));

  } else if (url === '/styles.css') {
    // Serve the CSS file
    serveCss(res, path.join(__dirname, 'styles.css'));

  } else if (url === '/read') {
    // Read the content of the text file
    readFileContent(res);

  } else if (url.startsWith('/write')) {
    // Write content to the text file (e.g., '/write?content=Hello')
    const content = new URL(`http://localhost${url}`).searchParams.get('content');
    writeFileContent(res, content || 'Default content');

  } else if (url === '/delete') {
    // Delete the text file
    deleteFile(res);

  } else if (url === '/rename') {
    // Rename the text file
    renameFile(res);

  } else if (url === '/list') {
    // List all files in the directory
    listFiles(res);

  } else {
    // 404 for undefined routes
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
