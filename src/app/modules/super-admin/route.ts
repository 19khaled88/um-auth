import express from "express";

import validationRequest from "../../middlewares/validationRequest";

import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { SuperAdminController } from "./controller";

const router = express.Router();



router.get('/checkDuplicte',SuperAdminController.checkIfSuperAdminDuplicate)



export const superAdminRoutes = router;