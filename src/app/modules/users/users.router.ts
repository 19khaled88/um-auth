import express from 'express'
import { userController } from './users.controller'
import validationRequest from '../../middlewares/validationRequest'
import { UserValidation } from './user.validation'

const router = express.Router()


router.post('/create-user',
    validationRequest(UserValidation.createdUserZodSchema),
    userController.createUser)

export const userRoutes = router