import express from "express";
import { adminController } from "./controller";
import validationRequest from "../../middlewares/validationRequest";
import { AdminZodValidation } from "./validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.get(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  adminController.getSingleAdmin
);
router.get(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  adminController.getAllAdmins
);
router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  adminController.deleteAdmin
);
router.put(
  "/:id",
  validationRequest(AdminZodValidation.updateAdminZodSchema),
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  adminController.updateAdmin
);

export const adminRoutes = router;
