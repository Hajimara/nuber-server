import dotenv from "dotenv";
dotenv.config();
import MailGun from "mailgun-js";

const mailGunClient = new MailGun({
  apiKey: process.env.MAILGUN_API_KEY || "",
  domain: "sandbox6920b6513c454084bf44fc4dc497ee79.mailgun.org"
});

const sendEmail = (subject: string, html: string) => {
  const emailData = {
    from: "zzoon.dev@gmail.com",
    to: "zzoon.dev@gmail.com",
    subject,
    html
  };
  return mailGunClient.messages().send(emailData);
};

export const sendVerificationEmail = (fullName: string, key: string) => {
  const emailSubject = `Hello! ${fullName}, please verify your email!`;
  const emailBody = `Verify your email by clicking <a href="http://number.com/verification/${key}/">here</a>`;
  return sendEmail(emailSubject, emailBody);
};
