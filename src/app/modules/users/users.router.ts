import express from "express";
import { userController } from "./users.controller";
import validationRequest from "../../middlewares/validationRequest";
import { UserValidation } from "./user.validation";
import { UserZodValidation } from "./user.studentValidation";
import { FacultyZodValidation } from "../faculty/validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { AdminZodValidation } from "../admin/validation";
import { SuperAdminZodValidation } from "../super-admin/validation";

const router = express.Router();

router.post(
  "/create-user",
  validationRequest(UserValidation.createdUserZodSchema),
  userController.createStudent
);
router.post(
  "/create-student",
  validationRequest(UserZodValidation.createStudentZodSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  userController.createStudent
);
router.post(
  "/create-faculty",
  validationRequest(FacultyZodValidation.createFacultyZodSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  userController.createFaculty
);
router.post(
  "/create-admin",
  validationRequest(AdminZodValidation.createAdminZodSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  userController.createAdmin
);
router.post(
  "/create-super-admin",
  validationRequest(SuperAdminZodValidation.createSuperAdminZodSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  userController.createSuperAdmin
);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.get("/:id", userController.singleUser);
router.get("/", userController.getUsers);

export const userRoutes = router;
