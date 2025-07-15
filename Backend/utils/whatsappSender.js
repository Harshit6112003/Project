const twilio = require("twilio");

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

exports.sendWhatsApp = async (phone) => {
  await client.messages.create({
    body: "Hello! Your invoice has been emailed.",
    from: `whatsapp:${process.env.TWILIO_WHATSAPP}`,
    to: `whatsapp:${phone}`,
  });
};
