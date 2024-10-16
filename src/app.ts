import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors'

import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './router/index';
const app:Application = express();

app.use(cors())
//parser
app.use(express.json())
app.use(express.urlencoded({extended:true}))




//application routes
// app.use('/api/v1/users/',userRoutes)
// app.use('/api/v1/academicSemester',academicSemesterRoutes)
app.use('/api/v1/',router)

app.get('/',async(req:Request,res:Response,next:NextFunction)=>{
    Promise.reject(new Error('Unhandled Promise Rejection'))
    // next(new Error('Unhandled Promise Rejection'));
});


app.use(globalErrorHandler)

export default app;