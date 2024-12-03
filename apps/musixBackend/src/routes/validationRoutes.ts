import { Router } from "express";
import validateEmailRegex from "../middlewares/EmailRegexCheck";
import { login, Register, resendVerificationEmail, verifyRegister } from "../controllers/User.controller";

const validationRoutes = Router();

validationRoutes.get("/", (req, res) => {
    res.json({
        msg: "not a valid route"
    })
})

validationRoutes.route("/register").post(validateEmailRegex, Register)
validationRoutes.route("/verify-registration").post(validateEmailRegex, verifyRegister)
validationRoutes.route("/resend-verification-otp").post(validateEmailRegex, resendVerificationEmail)
validationRoutes.route("/reset-password").post(validateEmailRegex)
validationRoutes.route("/confirm-reset-password").post(validateEmailRegex)
validationRoutes.route("/login").post(validateEmailRegex, login)

export default validationRoutes;