import { Request, Response } from "express";
import { errorMessage, HTTP_STATUS } from "../enums/enums";
import { PrismaClient } from "@prisma/client";
import OTPGenerator from "../helpers/generateOtp";
import SendEmail from "../helpers/sendEmail";
import { hashPassword } from "../helpers/hashPassword";

const prisma = new PrismaClient()

export const initiateResetPassword = async (req: Request, res: Response) => {
    try{
        const { email } = req.body;
        const user = await prisma.userSchema.findFirst({
            where: {
                email
            }
        })
        if (!user){
            res.status(HTTP_STATUS.NOT_FOUND).json({
                error: errorMessage.USER_NOT_EXIST
            })
            return
        }
        const OTP = OTPGenerator
        await prisma.userSchema.update({
            where:{
                email
            },
            data:{
                isResetPasswordInitiated: true,
                resetPasswordOTP: OTP
            }
        })
        const emailType = "RESET_PASSWORD"
        const emailResponse = await SendEmail({email, OTP, emailType})
        res.status(HTTP_STATUS.OK).json({
            msg: "Reset Password Initiated",
            otpStatus: emailResponse ? `email sent to ${email}` : "Issue in sending email"
        })
        return
    } catch(e: any){
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            error: e.message
        })
        return
    }
}

export const confirmResetPassword = async (req: Request, res: Response) => {
    try{
        const { email, otp, newPassword } = req.body
        if (!(email && otp && newPassword)){
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: errorMessage.REQUIRED_FIELDS
            })
            return
        } 
        const user = await prisma.userSchema.findFirst({
            where:{
                email
            }
        })
        if (!user){
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: errorMessage.USER_NOT_EXIST
            })
            return
        }
        if (!user.isResetPasswordInitiated){
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: "Password Reset not initiated"
            })
            return
        }
        if (user.resetPasswordOTP != otp){
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: errorMessage.INCORRECT_OTP
            })
            return
        }
        const hashedNew = await hashPassword(newPassword)
        await prisma.userSchema.update({
            where: {
                email
            },
            data: {
                isResetPasswordInitiated: false,
                resetPasswordOTP: " ",
                password: hashedNew
            }
        })
        res.status(HTTP_STATUS.OK).json({
            msg: "Password Updated Successfully!!"
        })
    } catch(e: any){
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            error: e.message
        })
    }
}