import jwt from "jsonwebtoken";

interface JwtPayload {
    id: string,
    email: string,
    username: string,
    isVerified: boolean
  }
  

const decryptJwt = (token: string) => {
    try{
        const decrypt = jwt.verify(token, process.env.JWT_SECRET || "") as JwtPayload;
        return ({
            userId: decrypt.id,
            email: decrypt.email,
            username: decrypt.username,
            isVerified: decrypt.isVerified
        })
    } catch(e: any){
        throw new Error(e.message);
    }
}

export default decryptJwt;