import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    requireTLS: true,//this parameter solved problem for me
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

export default transporter;