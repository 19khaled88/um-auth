

import mongoose from "mongoose";
import app from "./app";
import config from "./config";
const port = 3000;


async function dbConn(){
    try {
        await mongoose.connect(config.db_url as string)
        console.log('Database connected successfully')

        app.listen(config.port,()=>{
            console.log(`connection established on ${config.port}`)
        })
    } catch (error) {
        console.log('Database connection failed')
    }
}

dbConn();