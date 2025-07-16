const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM,      // your Gmail address
    pass: process.env.EMAIL_PASSWORD,  // your Gmail app password
  },
});

exports.sendInvoice = async (to, subject, text, pdfBuffer) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    attachments: [
      {
        filename: "invoice.pdf",
        content: pdfBuffer,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};
