const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { generatePDFBuffer } = require('../utils/pdfGenerator');
const { sendEmailWithAttachment } = require('../utils/emailSender');

const router = express.Router();

// File Upload Config
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => cb(null, `upload-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

// Excel Upload Route
router.post('/upload-excel', upload.single('file'), (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.SheetNames[0];
    const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

    fs.unlinkSync(req.file.path); // cleanup
    res.json({ success: true, data: json });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Excel parsing failed' });
  }
});

// Email with PDF Sending Route
router.post('/send-invoices', async (req, res) => {
  const { invoices, template } = req.body;

  if (!invoices || !Array.isArray(invoices)) {
    return res.status(400).json({ success: false, message: 'Invalid invoice data' });
  }

  let sentCount = 0;
  let failedCount = 0;

  for (const invoice of invoices) {
    try {
      // Generate PDF buffer for each invoice
      const pdfBuffer = await generatePDFBuffer(invoice, template);

      // Send Email
      await sendEmailWithAttachment({
        to: invoice.email,
        subject: `Invoice - ${invoice.id}`,
        text: 'Please find your invoice attached.',
        attachments: [
          {
            filename: `invoice-${invoice.id}.pdf`,
            content: pdfBuffer,
          },
        ],
      });

      sentCount++;
    } catch (err) {
      console.error(`Failed to send invoice to ${invoice.email}:`, err.message);
      failedCount++;
    }
  }

  res.json({
    success: true,
    message: 'Invoices processed',
    sent: sentCount,
    failed: failedCount,
  });
});

module.exports = router;
