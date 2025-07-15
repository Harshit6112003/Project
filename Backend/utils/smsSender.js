const twilio = require("twilio");

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

exports.sendSMS = async (phone) => {
  await client.messages.create({
    body: "Your invoice has been sent to your email.",
    from: process.env.TWILIO_PHONE,
    to: phone,
  });
};
