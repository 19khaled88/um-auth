import express from "express";
import { adminController } from "./controller";
import validationRequest from "../../middlewares/validationRequest";
import { AdminZodValidation } from "./validation";

const router = express.Router();

router.get("/:id", adminController.getSingleAdmin);
router.get("/", adminController.getAllAdmins);
router.delete("/:id", adminController.deleteAdmin);
router.put(
  "/:id",
  validationRequest(AdminZodValidation.updateAdminZodSchema),
  adminController.updateAdmin
);

export const adminRoutes = router;
