import express from 'express'

import validationRequest from '../../middlewares/validationRequest'
import { studentsController } from './controller'
import { StudentZodValidation } from './validation'


const router = express.Router()


router.put('/:id',validationRequest(StudentZodValidation.updateStudentZodSchema),studentsController.updateStudent)
router.delete('/:id',studentsController.deleteStudent)
router.get('/:id',studentsController.singleStudent)
router.get('/',studentsController.getAllStudents)

export const studentRoutes = router