import nodemailer from "nodemailer";

const CreateTransport = () => {
    return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS
        }
    })
}

export default CreateTransport;