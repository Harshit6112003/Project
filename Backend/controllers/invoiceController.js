const xlsx = require("xlsx");
const pdfGenerator = require("../utils/pdfGenerator");
const emailSender = require("../utils/emailSender");

exports.processInvoices = async (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]);

  const parsedInvoices = [];

  for (const row of data) {
    try {
      const pdfBuffer = await pdfGenerator.generatePDFBuffer(row);
      await emailSender.sendInvoice(row.Email, pdfBuffer);

      parsedInvoices.push(row);
    } catch (err) {
      console.error("❌ Failed to send invoice to:", row.Email, err.message);
    }
  }

  return parsedInvoices; // return for frontend display
};
