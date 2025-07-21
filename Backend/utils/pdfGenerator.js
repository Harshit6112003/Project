const puppeteer = require("puppeteer");
const ejs = require("ejs");
const path = require("path");

exports.generatePDFBuffer = async (invoiceData) => {
  const templatePath = path.join(__dirname, "../views/invoice-template.ejs");

  // ✅ Pass invoiceData to template
  const html = await ejs.renderFile(templatePath, { invoiceData });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({ format: "A4" });

  await browser.close();
  return pdfBuffer;
};
