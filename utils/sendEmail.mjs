import nodemailer from "nodemailer";
import envConfig from "../config/environment.mjs";

const sendEmail = async (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: envConfig.emailHost,
    port: envConfig.emailPort,
    auth: {
      user: envConfig.emailUser,
      pass: envConfig.emailPass,
    },
  });
  const mailOptions = {
    from: envConfig.emailUser,
    to: email,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      throw new Error("Email sending failed");
    }
    console.log("Email sent:", info.response);
  });
};

export default sendEmail;
