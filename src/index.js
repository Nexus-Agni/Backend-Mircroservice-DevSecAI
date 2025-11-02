import "dotenv/config"
import app from "./app.js"
import { connectDB, disconnectDB } from "./db/index_DB.js"

async function startServer() {
    try {
        await connectDB()
        const server = app.listen(process.env.PORT, ()=>{
            console.log(`Server listening at : http://localhost:${process.env.PORT}`);
        })
        
        const shutdown = async () => {
            server.close(async () => {
                await disconnectDB()
                process.exit(0)
            })
        }
    
        process.on('SIGINT', shutdown)
        process.on('SIGTERM', shutdown)
    } catch (error) {
        console.log("Failed to start server : ", error);
        process.exit(1)
    }
}

startServer()