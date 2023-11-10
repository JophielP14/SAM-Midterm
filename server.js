const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Files');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Serve static files from the public folder
app.use(express.static('public'));

// Handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  res.redirect('/');
});

// Get the list of files in the 'Files' directory
app.get('/files', (req, res) => {
  fs.readdir('Files', (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading files.');
    }
    res.json(files);
  });
});

// Handle file downloads
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'Files', filename);
  res.download(filePath);
});

// Handle file deletions
app.delete('/delete/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'Files', filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error deleting file.');
    }
    res.send('File deleted successfully.');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
