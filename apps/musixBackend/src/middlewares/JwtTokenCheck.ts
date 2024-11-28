import { Request, Response, NextFunction } from "express";
import decryptJwt from "../helpers/decryptJwt";
import { HTTP_STATUS } from "../enums/enums";

const JwtTokenCheck = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization
    
    if (!header || !header.startsWith("Bearer")){
        return res.status(HTTP_STATUS.NOT_AUTHORIZED).json({msg: "header doesn't exist"})
    }

    const token = header.split(" ")[1]
    if (!token){
        return res.status(HTTP_STATUS.NOT_AUTHORIZED).json({msg: "token doesn't exist"})
    }

    try{
        const decodedToken = decryptJwt(token)
        const username = decodedToken.username
        if (!username){
            return res.status(HTTP_STATUS.NOT_AUTHORIZED).json({msg: "no username present, token bad"})
        }
        req.username = username;
        next();

    }catch(e: any){
        res.status(HTTP_STATUS.NOT_AUTHORIZED).json({msg: e})
    }
}

export default JwtTokenCheck;
