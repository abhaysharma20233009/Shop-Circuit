const nodemailer = require('nodemailer');
const sendEmail = async (options) => {
  //1)Create a transpoter
  const transpoter = nodemailer.createTransport({
    //service
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    //Activate in gmail "less secure app " option
  });
  //2)Define the email options
  const mailOptions = {
    from: 'SwiSkills <abhijimmystar9999@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //3)Actually send the email
  await transpoter.sendMail(mailOptions);
};
module.exports = sendEmail;
