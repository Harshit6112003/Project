const ejs = require("ejs");
const htmlPdf = require("html-pdf");
const path = require("path");

exports.generatePDFBuffer = (data) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "../templates/invoice-template.ejs");
    
    ejs.renderFile(filePath, { invoice: data }, (err, html) => {
      if (err) return reject(err);

      htmlPdf.create(html).toBuffer((err, buffer) => {
        if (err) return reject(err);
        resolve(buffer);
      });
    });
  });
};
