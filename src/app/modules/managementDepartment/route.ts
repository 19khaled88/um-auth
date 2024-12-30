import express from "express";
import { managementController } from "./controller";
import validationRequest from "../../middlewares/validationRequest";
import { managementDepartmentValidation } from "./validation";

const router = express.Router();

router.post(
  "/create-department",
  validationRequest(
    managementDepartmentValidation.createManagementDepartmentZodSchema
  ),
  managementController.createDepartment
);

router.get("/:id", managementController.getSingleDepartment);
router.put(
  "/:id",
  validationRequest(
    managementDepartmentValidation.updateManagementDepartmentZodSchema
  ),
  managementController.udpateDepartment
);
router.delete('/:id',managementController.deleteDepartment)

router.get('/',managementController.getAllDepartments)

export const managementDepartmentRoutes = router;
