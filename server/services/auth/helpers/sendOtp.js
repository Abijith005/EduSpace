import nodemailer from "nodemailer";

async function sendOtp(email, subject, html) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      tls: {
        rejectUnauthorized: false,
      },
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      html: html,
    };

    // transporter.sendMail(mailOptions, function (error, info) {
      // if (error) {
      //   console.log("email sent error ", error);
      //   reject(error);
      // } else {
      //   console.log("email sent successfull");
      //   resolve();
      // }
    // });
  } catch (error) {
    console.log("Error", error);
  }
}

export default sendOtp;
