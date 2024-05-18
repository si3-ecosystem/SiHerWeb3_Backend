const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');

async function senderEmailService(to, subject, text) {
  try {
    const mailerSend = new MailerSend({
      apiKey: process.env.SENDER_MAIL_API_KEY,
    });
    const sentFrom = new Sender(process.env.SENDER_MAIL_FROM);
    const recipients = [
      new Recipient(to)
    ];
    const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo([process.env.SENDER_MAIL_FROM])
    .setSubject(subject)
    .setText(text);
  
  await mailerSend.email.send(emailParams);  
  } catch (error) {
    console.log(JSON.stringify(error));
  }
 
}
module.exports = { senderEmailService }
