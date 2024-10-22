import express from "express";
import validationRequest from "../../middlewares/validationRequest";
import { academicDepartmentController } from "./controller";
import { AcademicDepartmentValiation } from "./validation";

const router = express.Router();

router.post(
  "/create-academic-department",
  validationRequest(AcademicDepartmentValiation.createDepartmentZodSchema),
  academicDepartmentController.createAcademicDepartment
);

router.put(
  "/:id",
  validationRequest(AcademicDepartmentValiation.updateDepartmentZodSchema),
  academicDepartmentController.updateAcademicDepartment
);
router.delete("/:id", academicDepartmentController.deleteAcademicDepartment);
router.get("/:id", academicDepartmentController.singleAcademicDepartment);
router.get("/", academicDepartmentController.getAcademicDepartments);

export const academicDepartmentRoutes = router;
