import Transporter from "../config/emailServer.js";
import { emailTemplate } from "../emailTeamplates/emailTemplate.js";
import { passTemplate } from "../emailTeamplates/passTemplate.js";

interface EmailInputs {
    email: string,
    OTP: string,
    emailType: string 
}
const SendEmail = async ({email, OTP, emailType}: EmailInputs) => {
    const formattedRegisterTemplate = emailTemplate().replace(/\${email}/g, email)
                                                     .replace(/\${otp}/g, OTP)
    const formattedPasswordTemplate = passTemplate().replace(/\${email}/g, email)
                                                     .replace(/\${otp}/g, OTP)
    try{
        emailType.toUpperCase()
        const transporter = Transporter()
        const mailOptions = {
            from: process.env.USER_EMAIL || " ",
            to: email,
            subject: `${
                emailType === "REGISTER" ? "Account Verification - Musix" : "Password Reset - Musix"
            }`,
            html: emailType === "REGISTER" ? formattedRegisterTemplate : formattedPasswordTemplate
        }

        await transporter.sendMail(mailOptions)
        return "mail sent"
    } catch(e: any){
        throw new Error(e.message)
    }
}

export default SendEmail;