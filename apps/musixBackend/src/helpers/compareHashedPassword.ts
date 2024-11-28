import bcrypt from "bcrypt";

interface Inputs {
    password: string,
    hashedPassword: string
}

export const compareHashedPassword = async ({password, hashedPassword}: Inputs) => {
    return await bcrypt.compare(password, hashedPassword)
}