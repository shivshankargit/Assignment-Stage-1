import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void >{
    if (connection.isConnected) {
        console.log("Already connected to Database"); 
        return
    }

    try{
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})

        connection.isConnected = db.connections[0].readyState

        console.log("DB connected successfully");
    } catch (error ) {
        console.log("Database Connection failed", error);
        process.exit(1)
    }
}

export default dbConnect;