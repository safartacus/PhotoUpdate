import express from "express";
import * as photoController from "../controllers/photoController.js"
const router = express.Router();

router.route("/").get(photoController.getAllPhoto);
router.route("/addPhoto").post(photoController.createPhoto);

export default router;