import { NextFunction, Request, Response } from "express";

const validateEmailRegex = (req: Request, res: Response, next: NextFunction): void => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const userEmail = req.body.email;

  if (userEmail.length > 1000) {
    res.status(400).json({
      error: "email too long"
    });
    return;
  }

  if (!emailRegex.test(userEmail)) {
    res.status(400).json({
      msg: "email is invalid"
    });
    return;
  }

  next();
};

export default validateEmailRegex;