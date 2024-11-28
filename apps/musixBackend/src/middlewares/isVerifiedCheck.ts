import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { errorMessage, HTTP_STATUS } from "../enums/enums";

const isVerified = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const username = req.body.email;

        if (!username){
            return res.status(HTTP_STATUS.BAD_REQUEST).json({msg: errorMessage.USER_NOT_EXIST})
        }
        const prisma = new PrismaClient()
        const user = await prisma.userSchema.findFirst({
            where:{
                email: username
            }
        });

        if (!user?.isVerified){
            return res.status(HTTP_STATUS.NOT_AUTHORIZED).json({msg: errorMessage.USER_NOT_VERIFIED})
        }
        req.user = user;
        next()
    } catch(e: any){
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            error: e.message || "Error in isVerified middleware, check"
        })
    }
}
