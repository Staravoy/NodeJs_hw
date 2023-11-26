const nodemailer = require('nodemailer')
const dotenv = require('dotenv').config();

const { UKR_NET_PASSWORD, UKR_NET_EMAIL } = process.env

// console.log(UKR_NET_EMAIL)
// console.log(UKR_NET_PASSWORD)

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

const sendEmail = async (data) => {
    const email = { ...data, from: UKR_NET_EMAIL };
    return await transport.sendMail(email);
};


module.exports = sendEmail;

