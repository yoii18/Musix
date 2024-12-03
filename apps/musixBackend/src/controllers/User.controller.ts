import { Request, Response } from "express";
import { errorMessage, HTTP_STATUS } from "../enums/enums";import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../helpers/hashPassword";
import OTPGenerator from "../helpers/generateOtp";
import SendEmail from "../helpers/sendEmail";
import { compareHashedPassword } from "../helpers/compareHashedPassword";
import jwt from "jsonwebtoken";



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

export const verifyRegister = async (req: Request, res: Response): Promise<void> => {
  const { email, verificationCode } = req.body;
  try{
    const user = await prisma.userSchema.findFirst({
      where:{
        email
      }
    })

    if (!user){
      res.status(HTTP_STATUS.NOT_FOUND).send({
        error: errorMessage.USER_NOT_EXIST
      })
      return 
    }
    if(user.verificationCode != verificationCode){
      res.status(HTTP_STATUS.NOT_AUTHORIZED).send({
        error: errorMessage.INCORRECT_OTP
      })
      return 
    }
    await prisma.userSchema.update({
      where:{
        email
      },
      data:{
        isVerified: true,
        verificationCode: " "
      }
    })
    res.status(HTTP_STATUS.OK).send({
      msg: "Verified OK!!"
    })
    return 
  } catch(e: any){
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
      error: e.message
    })
    return 
  }
}

export const resendVerificationEmail = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body
  try {
    const user = await prisma.userSchema.findFirst({
      where:{
        email
      }
    })
    if (!user){
      res.status(HTTP_STATUS.NOT_FOUND).json({
        error: errorMessage.USER_NOT_EXIST
      })
      return 
    }
    if (user.isVerified){
       res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: errorMessage.USER_ALREADY_VERIFIED
      })
      return
    }
    const OTP = OTPGenerator
    await prisma.userSchema.update({
      where:{
        email
      },
      data:{
        verificationCode: OTP
      }
    })
    const emailType = "REGISTER"
    const emailStatus = await SendEmail({email, OTP, emailType})
     res.status(HTTP_STATUS.OK).json({
      msg: "Verification mail sent",
      otpstatus: emailStatus ? `OTP sent to ${email}` : `failed to send OTP`
    })
    return

  } catch(e: any){
     res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: e.message
    })
    return
  }
}

export const login = async (req: Request, res: Response) => {
  try{
    const { email, password } = req.body
    if (!email || !password){
       res.status(HTTP_STATUS.BAD_REQUEST).json({
        msg: errorMessage.REQUIRED_FIELDS
      })
      return
    }
    const user = await prisma.userSchema.findFirst({
      where:{ 
        email
      }
    })
    if (!(email && password)){
       res.status(HTTP_STATUS.BAD_REQUEST).json({
        msg: errorMessage.REQUIRED_FIELDS
      })
      return 
    }
    if (!user){      
       res.status(HTTP_STATUS.NOT_FOUND).json({
        msg: errorMessage.USER_NOT_EXIST
      })
      return 
    }
    
    const hashedPassword = user.password
    const checkPass = await compareHashedPassword({password, hashedPassword})
    if (!checkPass){
       res.status(HTTP_STATUS.BAD_REQUEST).json({
        msg: errorMessage.INCORRECT_PASSWORD
      })
      return 
    }
    const token = jwt.sign({
      userId: user.id,
      username: user.username,
      email: user.email,
      isVerified: user.isVerified
    }, process.env.JWT_SECRET || "", {expiresIn: "24h"})
    res.status(HTTP_STATUS.OK).send({
      message: "Login successful",
      token: token,
    });
    return 
  } catch(e: any){
     res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: e.message
    })
    return 
  }
}


export const getUser = async (req: Request, res: Response) => {
  const { username } = req.body
  try{
    if (!username){
       res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: errorMessage.REQUIRED_FIELDS
      })
      return 
    }
    const user = await prisma.userSchema.findFirst({
      where:{
        username
      },
      select: {
        id: true,
        username: true,
        profile: true,
        email: true,
        isVerified: true,
        verificationCode: true,
        isResetPasswordInitiated: true,
        resetPasswordOTP: true,
        resetPasswordExpiration: true
      }
    })
    if (!user){
       res.status(HTTP_STATUS.NOT_FOUND).json({
        error: errorMessage.USER_NOT_EXIST
      })
      return 
    }
     res.status(HTTP_STATUS.OK).json({
      user: user
    })
    return 
  } catch(e: any){
     res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: e.message
    })
    return 
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try{
    const { email } = req.user.email
    const { newUsername, profile } = req.body
    if (!email){
       res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: errorMessage.USER_NOT_EXIST
      })
      return 
    }
    if (newUsername){
      await prisma.userSchema.update({
        where:{
          email
        },
        data:{
          username: newUsername
        }
      })
    }
    if (profile){
      await prisma.userSchema.update({
        where:{
          email
        },
        data:{
          profile
        }
      })
    }
     res.status(HTTP_STATUS.OK).json({
      msg: "user updated!!"
    })
    return 
  } catch(e: any){
     res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: e.message
    })
    return 
  }
}