import express from 'express';
import { FacultyController } from './controller';
import validationRequest from '../../middlewares/validationRequest';
import { FacultyZodValidation } from './validation';

const router = express.Router();


router.get('/:id',FacultyController.getSingleFaculty);
router.get('/',FacultyController.getAllFaculties);
router.put('/:id',validationRequest(FacultyZodValidation.updateFacultyZodSchema),FacultyController.updateFaculty);
router.delete('/:id',FacultyController.deleteFaculty);


export const facultyRoutes = router;