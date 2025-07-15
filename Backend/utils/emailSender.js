const fs = require("fs");
const ejs = require("ejs");
const htmlPdf = require("html-pdf");
const path = require("path");

exports.generatePDFBuffer = (invoice) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "../templates/invoice-template.ejs");
    const logoPath = path.join(__dirname, "../public/image/FW_logo_new.png");
    const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });

    ejs.renderFile(filePath, { invoice, invoiceId: Math.floor(Math.random() * 10000), logoBase64 }, (err, html) => {
      if (err) return reject(err);

      htmlPdf.create(html).toBuffer((err, buffer) => {
        if (err) return reject(err);
        resolve(buffer);
      });
    });
  });
};
