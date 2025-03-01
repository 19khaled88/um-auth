import express from "express";
import { FacultyController } from "./controller";
import validationRequest from "../../middlewares/validationRequest";
import { FacultyZodValidation } from "./validation";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/checkDuplicate",FacultyController.checkIfFacultyDuplicate);
router.get(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.FACULTY,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  FacultyController.getSingleFaculty
);
router.get(
  "/",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.FACULTY,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  FacultyController.getAllFaculties
);
router.put(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.FACULTY,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  validationRequest(FacultyZodValidation.updateFacultyZodSchema),
  FacultyController.updateFaculty
);
router.delete(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.FACULTY,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  FacultyController.deleteFaculty
);

export const facultyRoutes = router;
