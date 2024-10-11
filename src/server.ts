import mongoose from "mongoose";
import app from "./app";
import config from "./config";
import {successLogger,errorLogger} from "./shared/logger/logger";



async function dbConn(){
    try {
        await mongoose.connect(config.db_url as string)
        successLogger.info('Database connected successfully')

        app.listen(config.port,()=>{
            successLogger.info(`connection established on ${config.port}`)
        })
    } catch (error) {
        errorLogger.error('Database connection failed')
    }


    // mongoose.connect(config.db_url as string)
    // .then(() => {
    //     console.log('MongoDB connected');
    //     app.listen(config.port,()=>{
    //         console.log(`connection established to server on ${config.port}`)
    //     })
    // })
    // .catch(err => {
    //     console.log('MongoDB connection error:', err);
    // });
}

dbConn();