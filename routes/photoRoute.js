import express from "express";
import * as photoController from "../controllers/photoController.js"
const router = express.Router();

router.route("/").get(photoController.getAllPhoto);
router.route("/addPhoto").post(photoController.createPhoto);
router.route("/:id").get(photoController.getPhotobyId);
router.route("/likephoto").post(photoController.likePhoto);
router.route("/addcomment").post(photoController.addComment);
router.route("/deletecomment").post(photoController.deleteComment);





export default router;