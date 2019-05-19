const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const emailConfig = require('../config/email');

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: false,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    }
});

module.exports = {
    send:   (options) => {
                try {
                    const renderHtml = pug.renderFile(`${__dirname}/../views/emails/${options.view}.pug`, options===null?{}:options);
                    const html = juice(renderHtml);
                    let mailOptions = {
                        from: 'Wundernode <no-reply@wundernode.com',
                        to: options.email,
                        subject: options.subject,
                        text: htmlToText.fromString(html),
                        html: html
                    }
                    transport.sendMail(mailOptions);
                } catch (error) {
                    console.log(error);
                }
            }
}