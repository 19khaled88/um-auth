import {  RequestHandler } from "express";
import { AcademicSemesterService } from "./academicSemester.service";



const createAcademicSemester:RequestHandler= async(req,res,next)=>{
     try {
        const {...academicSemesterData} = req.body
        const result = await AcademicSemesterService.createSemester(academicSemesterData)
        res.status(200).json({
            sucess:true,
            message:'Academic semester created successfully',
            data:result
        })
     } catch (error) {
       next(error)
     }
}

export const academicSemesterController = {
    createAcademicSemester
}