import 'dotenv/config'
import {PrismaClient} from "@prisma/client"

export const prisma = new PrismaClient()

export async function connectDB() {
    try {
        await prisma.$connect()
        console.log("Prisma Connected Successfully");
    } catch (error) {
        console.log("Error in connecting Prisma : ", error);
    }
}

export async function disconnectDB() {
    try {
        await prisma.$disconnect()
        console.log("Prisma Disconnected successfully");
    } catch (error) {
        console.log("Error in disconnecting Prisma : ", error);
    }
}