import express from "express";
import validationRequest from "../../middlewares/validationRequest";
import { academicFacultyController } from "./controller";
import { AcademicFacultyValiation } from "./validation";

const router = express.Router();

router.post(
  "/create-academic-faculty",
  validationRequest(AcademicFacultyValiation.createFacultyZodSchema),
  academicFacultyController.createAcademicFaculty
);

router.put(
  "/:id",
  validationRequest(AcademicFacultyValiation.updateFacultyZodSchema),
  academicFacultyController.updateAcademicFaculty
);
router.delete("/:id", academicFacultyController.deleteAcademicFaculty);
router.get("/:id", academicFacultyController.singleAcademicFaculty);
router.get("/", academicFacultyController.getAcademicFaculties);

export const academicFacultyRoutes = router;
