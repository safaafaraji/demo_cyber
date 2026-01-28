const nodemailer = require('nodemailer');
const logger = require('../../utils/logger');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER || 'safaa.faraji.fm@gmail.com',
                pass: process.env.SMTP_PASS // Need App Password from user
            }
        });
    }

    async sendVerificationCode(email, code) {
        logger.info(`Sending real verification email to ${email}`);

        const mailOptions = {
            from: '"Cyber Range Security" <safaa.faraji.fm@gmail.com>',
            to: email,
            subject: 'Verification Code - Cyber Range Access',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
                    <h2 style="color: #00f2fe;">Cyber Range Activation</h2>
                    <p>Welcome to the platform. Your security verification code is:</p>
                    <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
                        ${code}
                    </div>
                    <p style="color: #666; font-size: 12px; margin-top: 20px;">If you did not request this code, please ignore this email.</p>
                </div>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            logger.info(`Email sent successfully to ${email}`);
            return true;
        } catch (error) {
            logger.error(`Error sending email: ${error.message}`);
            // Fallback to logs if email fails (for dev test)
            console.log("CRITICAL: SMTP Failed, check credentials. Code: ", code);
            return false;
        }
    }

    async sendWelcomeEmail(user) {
        logger.info(`[EMAIL] Welcome email logic placeholder for ${user.email}`);
    }
}

module.exports = new EmailService();
