const nodemailer = require("nodemailer");

// Configure transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "dmet491@gmail.com",       // replace with your Gmail user
    pass: "ugba xsou lzit bogu ",               // replace with your Gmail password or app password
  },
});

/**
 * Send email function
 * @param {Object} options - { from, to, subject, text }
 * @returns {Promise} resolves with info or rejects with error
 */
function sendEmail(options) {
  return new Promise((resolve, reject) => {
    transporter.sendMail(options, (error, info) => {
      if (error) {
        return reject(error);
      }
      resolve(info);
    });
  });
}

module.exports = { sendEmail };
