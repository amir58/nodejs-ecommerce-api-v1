const nodemailer = require( "nodemailer" );

const sendEmail = async ( options ) => {
    // 1 - Create transporter 
    // ( service that sends email like gmail , mailgun , mailtrap , sendgrid )
    const transporter = nodemailer.createTransport( {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,// if secure false ports 587, if secure true port 465,
        secure: true,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    } );

    const mailOptions = {
        from: `E-Shop App <${ process.env.SMTP_EMAIL }>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail( mailOptions );
};

module.exports = sendEmail;