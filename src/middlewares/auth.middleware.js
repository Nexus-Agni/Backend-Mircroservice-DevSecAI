import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../db/index_DB";
import jwt from "jsonwebtoken"

const verifyJWT = asyncHandler(async (req, res, next) => {
    /*
    Steps: 
    1. Get the token from the cookies or header
    2. If token not present throw error
    3. Verify the token
    4. decode and find the user.
    5. Check and return accordingly
    */
    try {
        const token = req.cookies?.access_token || req.header("Authorization")?.replace("Bearer", "")
        if (!token) {
            throw new ApiError(401, "Unauthorized")
        }
    
        // const prisma = new PrismaClient();
        // const user = prisma.user;
    
        const decodedInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await prisma.user.findUnique({
            where : {
                id : decodedInfo?.id
            },
            omit : {
                passwordHash : true, 
                accessToken : true,
                refreshToken : true
            }
        })
    
        if (!user) {
            throw new ApiError(401, "Invalid Access Token ")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(500, error?.message || "Error in verifyingJWT")
    }

})