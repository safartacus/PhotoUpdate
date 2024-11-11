import express from "express";
import * as userController from "../controllers/userController.js";
const router = express.Router();

router.route("/").get(userController.getAllUsers);
router.route("/register").post(userController.createUser);
router.route("/userPhotos").get(userController.getAllPhotoByUser);
router.route("/getAllPhotoByUserId/:userId").get(userController.getAllPhotoByUserId);
router.route("/search").get(userController.searchUsers);
router.route("/followUnfollowUser").post(userController.followUnfollowUser);
router.route("/detail").get(userController.getUserdetail);
router.route("/userDetail").put(userController.updateUserDetail);

router.route("/:id").get(userController.getUserbyId);






export default router;