const nodemailer = require("nodemailer");

/**
 * Send a verification email to the user.
 *
 * This function sends an email to the provided user email address with a verification
 * code. The email is sent using Gmail's SMTP server, and the verification code is
 * included in the email body.
 *
 * @param {string} userEmail - The email address of the user to whom the verification code will be sent.
 * @param {string} verificationCode - The verification code to be included in the email.
 *
 * @example
 * // To send a verification email
 * sendVerificationEmail("user@example.com", "123456");
 */
async function sendVerificationEmail(userEmail, verificationCode) {
  // SMTP configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTH_USER,
      pass: process.env.AUTH_PASSWORD,
    },
  });

  // Email content
  const mailOptions = {
    from: process.env.AUTH_USER,
    to: userEmail,
    subject: "Foodly Verification Code",
    html: `<h1>Foodly Email Verification</h1>
               <p>Your verification code is:</p>
               <h2 style="color: blue;">${verificationCode}</h2>
               <p>Please enter this code on the verification page to complete your registration process.</p>
               <p>If you did not request this, please ignore this email.</p>`,
  };

  // Sending email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.log("Email send failed with error:", error);
  }
}

module.exports = sendVerificationEmail;
