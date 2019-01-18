const nodemailer = require('nodemailer');
const config = require('../config/mailer.js');

const transport = nodemailer.createTransport({
    service: 'hotmail',
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    auth: {
        user: process.env.MAILGUN_USER,
        pass: process.env.MAILGUN_PW
    },
    tls: {
        ciphers:'SSLv3'
    }
});

module.exports = {
    sendMail(from, to, subject, html) {
        return new Promise((resolve, reject) => {
            transport.sendMail({from, subject, to, html}, (err, info)=> {
                if(err) reject(err);
                resolve(info);
            });
        });
    }
}