import { Request, Response } from "express";
import { errorMessage, HTTP_STATUS } from "../enums/enums";import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../helpers/hashPassword";
import OTPGenerator from "../helpers/generateOtp";
import SendEmail from "../helpers/sendEmail";


const prisma = new PrismaClient()

export async function Register(req: Request, res: Response): Promise<void> {
  try {
    const { username, password, profile, email } = req.body;

    if (!(username && password && email && profile)) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        msg: errorMessage.REQUIRED_FIELDS
      });
      return;
    }

    const existingUser = await prisma.userSchema.findFirst({
      where: {
        email: email
      }
    });

    if (existingUser) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        msg: errorMessage.USER_ALREADY_EXIST
      });
      return;
    }

    const hashedPass = await hashPassword(password);
    const OTP = OTPGenerator;

    const newUser = await prisma.userSchema.create({
      data: {
        username: username,
        password: hashedPass,
        profile: profile || "",
        email,
        verificationCode: OTP,
      }
    });

    if (newUser) {
      const emailType = "REGISTER";
      SendEmail({ email, OTP, emailType });

      res.status(HTTP_STATUS.OK).json({
        message: "User registration successful",
        otpStatus: `OTP sent to ${email}`
      });
    } else {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        msg: "Failed to create user"
      });
    }
  } catch (e: any) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      msg: "Error registering user",
      error: e.message
    });
  }
}