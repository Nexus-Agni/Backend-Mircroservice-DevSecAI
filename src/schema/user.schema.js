import * as z from "zod"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const registerUserSchema = z.object({
    email : z.email("Invalid email format"),
    fullname : z.string(),
    password : z.string().min(8, "Password cannot be less than 8 chars")
})

export const createHashedPassword = async (password) => {
    return await bcrypt.hash(password, 10);
}

export async function generateRefreshAccessTokens(fullname, email, hashedPassword) {
    const refreshToken = jwt.sign(
        {
            fullname, email, hashedPassword
        }, 
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )

    const accessToken = jwt.sign(
        {
            fullname, email, hashedPassword
        }, 
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
    return {accessToken, refreshToken}
}