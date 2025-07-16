const { generatePDFBuffer } = require("../utils/pdfGenerator");
const { sendInvoice } = require("../utils/emailSender");

router.post("/send-invoices", async (req, res) => {
  const invoices = req.body.invoices; // array of invoices
  const results = [];

  for (const invoice of invoices) {
    try {
      const pdf = await generatePDFBuffer(invoice);
      await sendInvoice(invoice.email, "Your Invoice", "Please find your invoice attached.", pdf);
      results.push({ id: invoice.id, status: "sent" });
    } catch (err) {
      results.push({ id: invoice.id, status: "failed", error: err.message });
    }
  }

  res.json({ success: true, results });
});
