// routes/upload.js
const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Ensure 'uploads/' directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Endpoint to upload and parse Excel
router.post('/api/upload-excel', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Read Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    if (!jsonData || jsonData.length === 0) {
      return res.status(400).json({ success: false, message: 'Excel is empty or invalid' });
    }

    // Add ID to each row
    const invoices = jsonData.map((row, i) => ({
      id: `inv-${Date.now()}-${i}`,
      ...row,
    }));

    // Optionally delete file after parsing
    fs.unlinkSync(req.file.path);

    return res.json({
      success: true,
      message: 'Excel file parsed successfully',
      invoices,
    });

  } catch (err) {
    console.error('Parsing error:', err);
    return res.status(500).json({ success: false, message: 'Server error parsing Excel' });
  }
});

module.exports = router;
