


import express from "express";
import validationRequest from "../../middlewares/validationRequest";
import { AuthValidation } from "./validation";
import { authController } from "./controller";
const router = express.Router()

router.post('/refresh-token',authController.refreshToken)
router.post('/login',validationRequest(AuthValidation.loginZodSchema),authController.login)


export const authRoutes = router

