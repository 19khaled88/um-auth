import express from "express";
import { managementController } from "./controller";
import validationRequest from "../../middlewares/validationRequest";
import { managementDepartmentValidation } from "./validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.post(
  "/create-department",
  auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),
  validationRequest(
    managementDepartmentValidation.createManagementDepartmentZodSchema
  ),
  managementController.createDepartment
);

router.get("/:id", managementController.getSingleDepartment);
router.put(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),
  validationRequest(
    managementDepartmentValidation.updateManagementDepartmentZodSchema
  ),
  managementController.udpateDepartment
);
router.delete('/:id',managementController.deleteDepartment)

router.get('/',managementController.getAllDepartments)

export const managementDepartmentRoutes = router;
