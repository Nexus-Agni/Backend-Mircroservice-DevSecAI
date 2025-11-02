import { createHashedPassword, generateRefreshAccessTokens, registerUserSchema } from "../schema/user.schema.js";
import { prisma } from "../db/index_DB.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";


export const registerUser = asyncHandler(async (req, res, next) => {
    /*
    1. Extract the email, password, fullname
    2. Check if these fields are empty, also check using regex
    3. Check if user already exists with same email
    4. create user
    5. return response
    */
    try {
            const parsedData = registerUserSchema.safeParse(req.body);
        
            if (!parsedData.success) {
                const message = parsedData.error.issues[0].message; // get first error
                throw new ApiError(400, message);
            } 
            
            const {email, password, fullname} = parsedData.data;
        
            // const prisma = new PrismaClient();
            const existingUser = await prisma.user.findUnique({
                where : {
                    email : email
                }
            })
        
            if (existingUser) {
                throw new ApiError(509, "User already exists with this email")
            }
        
            const passwordHash = await createHashedPassword(password)
        
            const {accessToken, refreshToken} = await generateRefreshAccessTokens(fullname, email, passwordHash);
        
            const user = await prisma.user.create({
                data : {
                    email, fullname, passwordHash, refreshToken
                }
            })
        
            const createdUser = await prisma.user.findUnique({
                where : {
                    id : user.id
                }, 
                omit : {
                    passwordHash, refreshToken
                }
            })
        
            if (!createdUser) {
                throw new ApiError(500, "Something went wrong while creating the user")
            }
            const options = {
                httpOnly : true,
                secure : true
            }
        
            return res
                .status(200)
                .cookie("refreshToken", refreshToken, options)
                .cookie("accessToken", accessToken, options)
                .json(
                    new ApiResponse(
                        200,
                        {
                            user : createdUser, accessToken, refreshToken //FIXME: Should be removed from response
                        },
                        "User registered successfully"
                    )
                )
    } catch (error) {
        console.log("Error: ", error);
        
        throw new ApiError(500, error.message || "Something went wrong during registering user")
    }
})