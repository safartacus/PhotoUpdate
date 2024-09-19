import express from "express";
import * as loginController from "../controllers/loginController.js"
const router = express.Router();

router.route("/authentication").post(loginController.authentication);

export default router;