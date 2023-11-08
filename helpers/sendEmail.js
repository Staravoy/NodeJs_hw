const nodemailer = require("nodemailer");
const dotenv = require('dotenv');

const { UKR_NET_PASSWORD, UKR_NET_EMAIL } = process.env

const nodemailerConfig = {
    host: "smtp.ukr.net",
    port: 465,
    secure: true,
    auth: {
        user: UKR_NET_EMAIL,
        pass: UKR_NET_PASSWORD,
    }
}

const transport = nodemailer.createTransport(nodemailerConfig);

const email = {
    from: UKR_NET_EMAIL,
    to: "staravoy@outlook.com",
    subject: "Test email",
    html: "<strong>Test email</strong>"
}

transport.sendMail(email)
    .then(() => console.log("Лист відправленно!"))
    .catch(error => console.log(error.message))