const sgMail = require("@sendgrid/mail")
const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

async function sendEmail(to, subject, text) {
  return sgMail.send({
    to,
    from: process.env.SENDGRID_FROM,
    subject,
    text,
  })
}
async function senderEmailService(to, subject, text) {
  try {
    console.log(process.env.SENDER_MAIL_API_KEY);
    const mailerSend = new MailerSend({
      apiKey: process.env.SENDER_MAIL_API_KEY,
    });
    const sentFrom = new Sender("rafaymuhammad245@gmail.com", "Your name");
    const recipients = [
      new Recipient(to, "Your Client")
    ];
    const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject(subject)
    .setHtml("<strong>This is the HTML content</strong>")
    .setText("This is the text content");
  
  await mailerSend.email.send(emailParams);  
  } catch (error) {
    console.log(error);
  }
 
}
module.exports = { sendEmail,senderEmailService }
