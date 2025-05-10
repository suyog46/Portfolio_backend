import nodemailer from 'nodemailer';

export const sendFeedbackEmail = async ({
  name,
  email,
  message,
}) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,     // your Gmail address
      pass: process.env.GMAIL_PASS,     // app password (not your normal Gmail password)
    },
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.GMAIL_USER, // you receive the email
    subject: 'New Portfolio Feedback',
    html: `
      <h3>New Message from ${name}</h3>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Feedback:</strong></p>
      <p>${message}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};