const puppeteer = require("puppeteer");
const ejs = require("ejs");
const path = require("path");

exports.generatePDFBuffer = async (invoiceData) => {
  const templatePath = path.join(__dirname, "../templates/invoiceTemplate.ejs");
  const html = await ejs.renderFile(templatePath, { invoice: invoiceData });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  const pdfBuffer = await page.pdf({ format: "A4" });

  await browser.close();
  return pdfBuffer;
};
