const xlsx = require("xlsx");
const pdfGenerator = require("../utils/pdfGenerator");
const emailSender = require("../utils/emailSender");
const smsSender = require("../utils/smsSender");
const whatsappSender = require("../utils/whatsappSender");

exports.processInvoices = async (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]);

  for (const row of data) {
    try {
      const pdfBuffer = await pdfGenerator.generatePDFBuffer(row);
      await emailSender.sendInvoice(row.Email, pdfBuffer);
      await smsSender.sendSMS(row.Phone);
      await whatsappSender.sendWhatsApp(row.Phone);
    } catch (err) {
      console.error("Error processing row:", row, err);
    }
  }
};
