import nodemailer from "nodemailer";
import env from "../config/environment.mjs";

const sendEmail = async (email, subject, text, html = null) => {
  // Check if email configuration is available
  if (!env.emailHost || !env.emailUser || !env.emailPass) {
    console.warn("Email configuration not available, skipping email send");
    return { success: false, message: "Email configuration not available" };
  }

  const transporter = nodemailer.createTransport({
    host: env.emailHost,
    port: env.emailPort,
    secure: env.emailPort === 465, // true for 465, false for other ports
    auth: {
      user: env.emailUser,
      pass: env.emailPass,
    },
  });
  const mailOptions = {
    from: env.emailUser,
    to: email,
    subject,
    text,
    ...(html && { html }),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};

export default sendEmail;
