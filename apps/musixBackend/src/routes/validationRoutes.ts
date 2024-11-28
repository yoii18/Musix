import { Router } from "express";
import validateEmailRegex from "../middlewares/EmailRegexCheck";

const validationRoutes = Router();

validationRoutes.get("/", (req, res) => {
    res.json({
        msg: "not a valid route"
    })
})

validationRoutes.route("/register").post(validateEmailRegex)
validationRoutes.route("/verify-registration").post(validateEmailRegex)
validationRoutes.route("/resend-verification-otp").post(validateEmailRegex)
validationRoutes.route("/reset-password").post(validateEmailRegex)
validationRoutes.route("/confirm-reset-password").post(validateEmailRegex)
validationRoutes.route("/login").post(validateEmailRegex)

export default validationRoutes;