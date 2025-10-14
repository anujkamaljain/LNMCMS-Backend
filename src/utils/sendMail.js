const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS   
  }
});

const sendMail = async({ to, subject, text }) => {
  try {
    console.log('Attempting to send email to:', to);
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending failed:', error.message);
    console.error('Full error:', error);
    throw error; // Re-throw to let calling code handle it
  }
};

module.exports = sendMail;
