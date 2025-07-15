const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const invoiceController = require("../controllers/invoiceController");

// Configure multer for Excel uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `invoices_${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({ storage });

// Route: POST /upload
router.post("/", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  try {
    await invoiceController.processInvoices(filePath);
    fs.unlinkSync(filePath); // delete after processing
    res.status(200).json({ message: "Invoices sent successfully!" });
  } catch (error) {
    console.error("Invoice processing failed:", error);
    res.status(500).json({ message: "Failed to process invoices" });
  }
});

module.exports = router;
