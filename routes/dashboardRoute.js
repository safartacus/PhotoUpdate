import express from "express";
import * as dasboardController from "../controllers/dashboardController.js"
const router = express.Router();

router.route("/").get(dasboardController.getDashboardPagebyId);

export default router;