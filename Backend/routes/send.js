// routes/send.js
const express = require("express");
const router = express.Router();
const { sendInvoices } = require("../controllers/sendInvoicesController");

router.post("/send-invoices", sendInvoices);

module.exports = router;
