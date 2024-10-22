import express from 'express'
import { userController } from './users.controller'
import validationRequest from '../../middlewares/validationRequest'
import { UserValidation } from './user.validation'

const router = express.Router()


router.post('/create-user',
    validationRequest(UserValidation.createdUserZodSchema),
    userController.createUser)

router.put('/:id',userController.updateUser)
router.delete('/:id',userController.deleteUser)
router.get('/:id',userController.singleUser)
router.get('/',userController.getUsers)

export const userRoutes = router