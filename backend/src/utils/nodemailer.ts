import nodemailer from 'nodemailer';

function generateOtp(): string {
    const digits = '1234567890';
    let otp = '';
    for (let i = 0; i < 6; i++) { 
        otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
}

interface SendOtpResponse {
    status: boolean;
    otp?: string;
    message?: string;
}

const sendOtp = async (email: string): Promise<SendOtpResponse> => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL, 
                pass: process.env.PASSWORD
            },
            tls: {
                rejectUnauthorized: false 
            }
        });

        const otp = generateOtp();
       
        const info = await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Verify Your Account ✔',
            text: `Your OTP is: ${otp}`,
            html: `<b>
                <h2 style="color: #3498db;">Verify Your Account</h2>
                <p style="font-size: 16px;">Thank you for creating an account! To complete the verification process, use the following OTP:</p>
                <p style="font-size: 24px; font-weight: bold; color: #2ecc71;">Your OTP is: ${otp}</p>
                <p style="font-size: 14px; margin-top: 20px;">Click the button below to verify your email:</p>
                <a href="#" style="display: inline-block; padding: 10px 20px; background-color: #2ecc71; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px;">Verify Email</a>
              </b>`,
        });

        if (info.accepted.length > 0) {
            return { status: true, otp };
        } else {
            return { status: false, message: 'Nodemailer failed to send email' };
        }
    } catch (error) {
        console.error('Error in sending OTP:', error);
        return { status: false, message: 'Internal Server Error' };
    }
};

export { sendOtp };
