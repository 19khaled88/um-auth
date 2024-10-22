import express from 'express'
import validationRequest from '../../middlewares/validationRequest'
import { AcademicSemesterValidation } from './academicSemester.validation'
import { academicSemesterController } from './academicSemester.controller'


const router = express.Router()


router.post('/create-semester',
    validationRequest(AcademicSemesterValidation.academicSemesterZodSchema),
    academicSemesterController.createAcademicSemester
)
router.get('/:id',academicSemesterController.getSingleAcademicSemester)
router.put('/:id',validationRequest(AcademicSemesterValidation.updateAcademicSemesterZodSchema),academicSemesterController.updateAcademicSemester)
router.delete('/:id',academicSemesterController.deleteAcademicSemester)
router.get('/',academicSemesterController.getAllAcademicSemester)

export const academicSemesterRoutes = router