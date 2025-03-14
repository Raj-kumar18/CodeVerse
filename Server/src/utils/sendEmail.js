import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // Gmail use kar rahe ho toh ye rakho
  auth: {
    user: process.env.EMAIL_USER, // Apna email
    pass: process.env.EMAIL_PASS, // App password (2FA enabled ho toh)
  },
});

export const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Email sending failed");
  }
};
