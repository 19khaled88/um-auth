import express from "express";

import validationRequest from "../../middlewares/validationRequest";
import { studentsController } from "./controller";
import { StudentZodValidation } from "./validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.put(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.STUDENT,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.FACULTY
  ),
  validationRequest(StudentZodValidation.updateStudentZodSchema),
  studentsController.updateStudent
);
router.delete(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.STUDENT,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.FACULTY
  ),
  studentsController.deleteStudent
);
router.get("/checkDuplicate",studentsController.checkIfStudentDuplicate)
router.get("/:id", studentsController.singleStudent);
router.get("/", studentsController.getAllStudents);

export const studentRoutes = router;
