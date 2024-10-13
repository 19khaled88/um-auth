import express from 'express'
import validationRequest from '../../middlewares/validationRequest'
import { AcademicSemesterValidation } from './academicSemester.validation'
import { academicSemesterController } from './academicSemester.controller'


const router = express.Router()


router.post('/create-semester',
    validationRequest(AcademicSemesterValidation.academicSemesterZodSchema),
    academicSemesterController.createAcademicSemester
)

export const academicSemesterRoutes = router